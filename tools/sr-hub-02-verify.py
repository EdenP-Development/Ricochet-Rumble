"""Read-only historical R10 consumer pilot; never use a rebuilt APK as evidence."""
import hashlib,json,pathlib,subprocess,sys,zipfile,importlib.util
BASE="80cd22b35b9bb285751ef82e69e1d63f3551edfe"
ZIP_SHA="cc69148dd87fcc8bbbff4dc86ff8dbb3c5ec2fd97910713d96ee39a8aa501f61"
HUB="b4d7d05bb9e8ada15fb053a584409e7532e9444c"
def require(ok,msg):
    if not ok: raise ValueError(msg)
def sha(b): return hashlib.sha256(b).hexdigest()
def git(*args): return subprocess.check_output(["git",*args])
def module(path,blob):
    require(git("hash-object",str(path)).decode().strip()==blob,"Toolkit blob mismatch")
    spec=importlib.util.spec_from_file_location(path.stem,path)
    obj=importlib.util.module_from_spec(spec);spec.loader.exec_module(obj);return obj
root=pathlib.Path.cwd()
archive=pathlib.Path(sys.argv[1]);hub=pathlib.Path(sys.argv[2]);out=pathlib.Path(sys.argv[3]);out.mkdir(parents=True,exist_ok=True)
require(sha(archive.read_bytes())==ZIP_SHA,"Historical artifact ZIP hash mismatch")
v8=module(hub/"toolkit/edt-08/v0.1/verify_baseline.py","d36a65add512ea477bd9bf40c8521c7d8d2f9037")
v9=module(hub/"toolkit/edt-09/v0.4/verify_package.py","c17dca7b73df2936408ab110e3e5da03eb08db49")
files=["game.js","index.html","style.css","scored-match.js","dossier.js","save-backup.js"]
art=["assets/m12/hangar-warm-empty-v1.svg"]+["assets/m12/mode-"+n+"-study-v1.svg" for n in ("cqc","ffa","tdm","custom")]+["assets/m12/insignia-"+n+"-study-v1.svg" for n in ("field","vector","ace","command")]
native="android/app/src/main/assets/"
paths=["web/"+n for n in files+art]+[native+n for n in files+art]+[native+"branding/spudacus-v1-full-transparent.png"]
manifest={"schema":1,"files":[{"path":n,"sha256":sha(git("show",BASE+":"+n))} for n in paths]}
baseline=v8.verify(root,manifest)
required={"assets/"+n:sha(git("show",BASE+":web/"+n)) for n in files+art}
logo=sha(git("show",BASE+":"+native+"branding/spudacus-v1-full-transparent.png"))
require(logo=="74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25","Approved logo mismatch")
required["assets/branding/spudacus-v1-full-transparent.png"]=logo
with zipfile.ZipFile(archive) as z:
    names=z.namelist();require(len(names)==len(set(names)),"Duplicate ZIP entries")
    receipt=dict(line.split("=",1) for line in z.read("dist/verification.txt").decode().splitlines() if "=" in line)
    require(receipt.get("SOURCE_SHA")==BASE and receipt.get("APP_ID")=="com.playereden.ricochetrumble.spudacusqa" and receipt.get("SIGNER")=="DISPOSABLE_DEBUG_NOT_PUBLIC_BETA","Historical receipt identity mismatch")
    apk=out/"historical-review.apk"
    entry=z.getinfo("dist/Sector-Rebound-B1-R10-Consolidated-Review.apk")
    require(entry.file_size<=512*1024*1024,"APK too large")
    apk.write_bytes(z.read(entry))
    package_receipt={"schema":1,"apk_sha256":receipt["APK_SHA256"],"required":required,"exclusive_prefixes":[]}
    package=v9.verify(apk,package_receipt)
    apk.unlink()
for name,data in [("baseline-manifest",manifest),("package-receipt",package_receipt),("result",{"status":"PASS","source":BASE,"hub":HUB,"artifact_zip_sha256":ZIP_SHA,"baseline":baseline,"package":package,"scope":"listed bytes only; not signature, rights or physical verification"})]:
    (out/(name+".json")).write_text(json.dumps(data,indent=2)+"\n")
print("SR_HUB_02_PASS",len(paths),len(required),package["apk_sha256"])
