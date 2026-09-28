const DEFAULT_SAMPLE_RATE=16000;
const DEFAULT_WINDOW_SECONDS=3;
const DEFAULT_COOLDOWN_MS=2000;

export function resampleLinear(input,inputRate,outputRate=DEFAULT_SAMPLE_RATE){
  if(!(input instanceof Float32Array)) input=Float32Array.from(input||[]);
  if(!input.length||!Number.isFinite(inputRate)||inputRate<=0||!Number.isFinite(outputRate)||outputRate<=0)return new Float32Array();
  if(inputRate===outputRate)return input.slice();
  const length=Math.max(1,Math.round(input.length*outputRate/inputRate)),out=new Float32Array(length),ratio=inputRate/outputRate;
  for(let i=0;i<length;i++){
    const pos=i*ratio,left=Math.floor(pos),right=Math.min(input.length-1,left+1),frac=pos-left;
    out[i]=(input[left]||0)+((input[right]||0)-(input[left]||0))*frac;
  }
  return out;
}

export class RollingAudioWindow{
  constructor(sampleRate=DEFAULT_SAMPLE_RATE,seconds=DEFAULT_WINDOW_SECONDS){
    this.sampleRate=sampleRate;this.capacity=Math.round(sampleRate*seconds);this.buffer=new Float32Array(this.capacity);this.length=0;
  }
  push(samples){
    if(!(samples instanceof Float32Array))samples=Float32Array.from(samples||[]);
    if(!samples.length)return;
    if(samples.length>=this.capacity){this.buffer.set(samples.subarray(samples.length-this.capacity));this.length=this.capacity;return}
    const overflow=Math.max(0,this.length+samples.length-this.capacity);
    if(overflow>0){this.buffer.copyWithin(0,overflow,this.length);this.length-=overflow}
    this.buffer.set(samples,this.length);this.length+=samples.length;
  }
  snapshot(){
    const out=new Float32Array(this.capacity);
    if(this.length)out.set(this.buffer.subarray(0,this.length),this.capacity-this.length);
    return out;
  }
  clear(){this.length=0;this.buffer.fill(0)}
}

export class WakeCooldown{
  constructor(ms=DEFAULT_COOLDOWN_MS){this.ms=ms;this.last=-Infinity}
  accept(now=performance?.now?.()??Date.now()){
    if(now-this.last<this.ms)return false;
    this.last=now;return true;
  }
  reset(){this.last=-Infinity}
}

export class NyxOnnxWakeDetector{
  constructor({ort=null,modelUrl="/models/nyx/wakeword.onnx",configUrl="/models/nyx/wakeword.json",cooldownMs=DEFAULT_COOLDOWN_MS,onWake=()=>{},onError=()=>{}}={}){
    this.ort=ort;this.modelUrl=modelUrl;this.configUrl=configUrl;this.onWake=onWake;this.onError=onError;
    this.session=null;this.threshold=.78;this.sampleRate=DEFAULT_SAMPLE_RATE;this.windowSeconds=DEFAULT_WINDOW_SECONDS;
    this.window=new RollingAudioWindow(this.sampleRate,this.windowSeconds);this.cooldown=new WakeCooldown(cooldownMs);
    this.context=null;this.source=null;this.processor=null;this.stream=null;this.running=false;this.inferenceBusy=false;this.lastInferenceAt=0;
  }
  async init(){
    if(this.session)return true;
    const ort=this.ort||globalThis.ort;
    if(!ort?.InferenceSession||!ort?.Tensor)throw new Error("ONNX Runtime Web is not loaded.");
    const response=await fetch(this.configUrl,{cache:"no-store"});
    if(!response.ok)throw new Error("Nyx wake model configuration is not installed.");
    const config=await response.json();
    if(Number.isFinite(Number(config.threshold)))this.threshold=Math.max(0,Math.min(1,Number(config.threshold)));
    if(Number(config.sample_rate)&&Number(config.sample_rate)!==DEFAULT_SAMPLE_RATE)throw new Error("Nyx wake model must use 16 kHz audio.");
    this.session=await ort.InferenceSession.create(this.modelUrl,{executionProviders:["wasm"]});
    this.ort=ort;return true;
  }
  async start(stream){
    if(this.running)return true;
    await this.init();
    const AudioContextCtor=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!AudioContextCtor)throw new Error("Web Audio is unavailable.");
    this.context=new AudioContextCtor();
    if(this.context.state==="suspended")await this.context.resume();
    this.stream=stream;
    this.source=this.context.createMediaStreamSource(stream);
    const processor=this.context.createScriptProcessor(2048,1,1);this.processor=processor;
    processor.onaudioprocess=event=>{
      if(!this.running)return;
      const mono=event.inputBuffer.getChannelData(0),resampled=resampleLinear(mono,this.context.sampleRate,this.sampleRate);
      this.window.push(resampled);
      const now=performance.now();
      if(this.window.length>=this.sampleRate&&now-this.lastInferenceAt>=250&&!this.inferenceBusy){this.lastInferenceAt=now;void this.infer(now)}
    };
    this.source.connect(processor);processor.connect(this.context.destination);this.running=true;return true;
  }
  async infer(now=performance.now()){
    if(!this.running||this.inferenceBusy||!this.session)return null;
    this.inferenceBusy=true;
    try{
      const waveform=this.window.snapshot(),tensor=new this.ort.Tensor("float32",waveform,[1,waveform.length]);
      const feeds={};feeds[this.session.inputNames?.[0]||"waveform"]=tensor;
      const result=await this.session.run(feeds),output=result[this.session.outputNames?.[0]||"score"],score=Number(output?.data?.[0]);
      if(Number.isFinite(score)&&score>=this.threshold&&this.cooldown.accept(now))await this.onWake({score,threshold:this.threshold,at:Date.now()});
      return Number.isFinite(score)?score:null;
    }catch(error){this.onError(error);return null}
    finally{this.inferenceBusy=false}
  }
  async stop({stopTracks=false}={}){
    this.running=false;
    try{this.processor?.disconnect()}catch{}try{this.source?.disconnect()}catch{}
    this.processor=null;this.source=null;
    if(stopTracks){try{this.stream?.getTracks?.().forEach(track=>track.stop())}catch{}}
    this.stream=null;this.window.clear();this.cooldown.reset();
    try{await this.context?.close()}catch{}this.context=null;
  }
  async release(){await this.stop();try{await this.session?.release?.()}catch{}this.session=null}
}

export const NYX_WAKE_RUNTIME={sampleRate:DEFAULT_SAMPLE_RATE,windowSeconds:DEFAULT_WINDOW_SECONDS,cooldownMs:DEFAULT_COOLDOWN_MS};
