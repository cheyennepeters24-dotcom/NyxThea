const DB_NAME="nyxthea-wake-training";
const DB_VERSION=1;
const STORE="samples";

function openDb(){
  if(!globalThis.indexedDB)return Promise.reject(new Error("Local wake-sample storage is unavailable in this browser."));
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:"id"});store.createIndex("profileDevice","profileDevice",{unique:false});store.createIndex("label","label",{unique:false});store.createIndex("createdAt","createdAt",{unique:false})}};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error("Could not open local wake-sample storage."));
  });
}
function transaction(db,mode,run){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);let result;
    try{result=run(store,tx)}catch(error){reject(error);return}
    tx.oncomplete=()=>resolve(result);
    tx.onerror=()=>reject(tx.error||new Error("Local wake-sample storage failed."));
    tx.onabort=()=>reject(tx.error||new Error("Local wake-sample storage was cancelled."));
  });
}
export async function saveWakeTrainingSample({profileId,deviceId,label="positive",promptKind="normal",blob,transcript="",mimeType}={}){
  if(!profileId||!deviceId||!(blob instanceof Blob)||blob.size<100)throw new Error("A valid wake sample is required.");
  if(!["positive","negative","background"].includes(label))throw new Error("Invalid wake sample label.");
  const createdAt=new Date().toISOString(),id=`${profileId}:${deviceId}:${createdAt}:${crypto.randomUUID()}`,profileDevice=`${profileId}:${deviceId}`;
  const record={id,profileId,deviceId,profileDevice,label,promptKind:String(promptKind||"").slice(0,48),transcript:String(transcript||"").slice(0,160),mimeType:String(mimeType||blob.type||"audio/webm").slice(0,80),size:blob.size,createdAt,blob};
  const db=await openDb();await transaction(db,"readwrite",store=>store.put(record));db.close();return {...record,blob:undefined};
}
export async function listWakeTrainingSamples({profileId,deviceId}={}){
  const db=await openDb(),profileDevice=profileId&&deviceId?`${profileId}:${deviceId}`:null;
  const rows=await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly"),store=tx.objectStore(STORE),request=profileDevice?store.index("profileDevice").getAll(profileDevice):store.getAll();
    request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error);
  });db.close();
  return rows.map(({blob,...row})=>row).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
}
export async function clearWakeTrainingSamples({profileId,deviceId}={}){
  const db=await openDb(),key=profileId&&deviceId?`${profileId}:${deviceId}`:null;
  if(!key){await transaction(db,"readwrite",store=>store.clear());db.close();return true}
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readwrite"),index=tx.objectStore(STORE).index("profileDevice"),request=index.openCursor(IDBKeyRange.only(key));
    request.onsuccess=()=>{const cursor=request.result;if(cursor){cursor.delete();cursor.continue()}};
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
  });db.close();return true;
}
const blobToBase64=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]||"");reader.onerror=()=>reject(reader.error||new Error("Could not read wake sample."));reader.readAsDataURL(blob)});
export async function exportWakeTrainingBundle({profileId,deviceId,download=true}={}){
  if(!profileId||!deviceId)throw new Error("Profile and device are required.");
  const db=await openDb(),key=`${profileId}:${deviceId}`;
  const records=await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly"),request=tx.objectStore(STORE).index("profileDevice").getAll(key);
    request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error);
  });db.close();
  const samples=[];for(const record of records.sort((a,b)=>a.createdAt.localeCompare(b.createdAt))){samples.push({id:record.id,label:record.label,promptKind:record.promptKind,transcript:record.transcript,mimeType:record.mimeType,createdAt:record.createdAt,audioBase64:await blobToBase64(record.blob)})}
  const bundle={format:"nyxthea-wake-training-v1",wakeWord:"Nyx",profileId,deviceId,exportedAt:new Date().toISOString(),sampleCount:samples.length,samples};
  const blob=new Blob([JSON.stringify(bundle)],{type:"application/json"});
  if(download){
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`nyx-training-${deviceId.slice(0,16)}-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return bundle;
}
