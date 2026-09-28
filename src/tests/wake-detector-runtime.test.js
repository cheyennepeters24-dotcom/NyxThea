import test from "node:test";
import assert from "node:assert/strict";
import { NYX_WAKE_RUNTIME, RollingAudioWindow, WakeCooldown, resampleLinear } from "../../public/nyx-wake-detector.js";

test("Nyx wake runtime is fixed to the approved 16 kHz three-second window and two-second cooldown",()=>{
  assert.equal(NYX_WAKE_RUNTIME.sampleRate,16000);
  assert.equal(NYX_WAKE_RUNTIME.windowSeconds,3);
  assert.equal(NYX_WAKE_RUNTIME.cooldownMs,2000);
});

test("linear resampling preserves bounded audio and target length",()=>{
  const input=new Float32Array([0,.5,1,.5,0,-.5,-1,-.5]);
  const output=resampleLinear(input,8000,16000);
  assert.equal(output.length,16);
  assert.ok(output.every(value=>Number.isFinite(value)&&value>=-1&&value<=1));
});

test("rolling wake window keeps only the newest audio",()=>{
  const window=new RollingAudioWindow(4,1);
  window.push(new Float32Array([1,2,3]));
  assert.deepEqual([...window.snapshot()],[0,1,2,3]);
  window.push(new Float32Array([4,5]));
  assert.deepEqual([...window.snapshot()],[2,3,4,5]);
  window.clear();
  assert.deepEqual([...window.snapshot()],[0,0,0,0]);
});

test("wake cooldown permits one wake per two seconds",()=>{
  const cooldown=new WakeCooldown(2000);
  assert.equal(cooldown.accept(1000),true);
  assert.equal(cooldown.accept(2999),false);
  assert.equal(cooldown.accept(3000),true);
  cooldown.reset();
  assert.equal(cooldown.accept(3001),true);
});
