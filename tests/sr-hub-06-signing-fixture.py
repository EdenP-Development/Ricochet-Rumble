#!/usr/bin/env python3
"""Actual SDK signing fixture. Never reads project signing secrets."""
import os, pathlib, subprocess, tempfile, hashlib, base64, re, zipfile
def run(*args,env=None,ok=True):
    p=subprocess.run(args,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    if (p.returncode==0)!=ok: raise RuntimeError("Unexpected exit: "+str(args[0:2])+"\n"+p.stdout)
    return p.stdout
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
sdk=pathlib.Path(os.environ["ANDROID_HOME"])
bt=sdk/"build-tools/35.0.0"
src=pathlib.Path("tools/sign-sector-rebound-beta-review.sh").read_text()
with tempfile.TemporaryDirectory() as td:
    d=pathlib.Path(td); key=d/"fixture.p12"
    run("keytool","-genkeypair","-alias","fixture","-keyalg","RSA","-keysize","2048","-validity","30","-dname","CN=Disposable SDK Fixture","-storetype","PKCS12","-keystore",str(key),"-storepass","fixture-only","-keypass","fixture-only")
    cert=d/"cert.der"
    run("keytool","-exportcert","-alias","fixture","-keystore",str(key),"-storepass","fixture-only","-file",str(cert))
    fingerprint=sha(cert)
    # Test-only copy substitutes fixture cert and package; actual production script never accepts an override.
    realcert="43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7"
    if src.count(realcert)!=1: raise ValueError("Unexpected certificate anchor")
    fixture=d/"fixture-sign.sh"
    fixture.write_text(src.replace(realcert,fingerprint).replace("com.playereden.ricochetrumble.beta","com.example.srfixture"))
    prod=pathlib.Path("tools/sign-sector-rebound-beta-review.sh").resolve()
    def make(version=1,debug=False,package="com.example.srfixture"):
        manifest=d/"AndroidManifest.xml"
        manifest.write_text(f'<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="{package}" android:versionCode="{version}" android:versionName="0.9.80-beta.{version}"><uses-sdk android:minSdkVersion="26" android:targetSdkVersion="36"/><application android:label="Synthetic Fixture" android:debuggable="{str(debug).lower()}"/></manifest>')
        unaligned=d/"raw.apk"; apk=d/f"fixture-{version}-{debug}-{package}.apk"
        run(str(bt/"aapt2"),"link","-I",str(sdk/"platforms/android-36/android.jar"),"--manifest",str(manifest),"-o",str(unaligned))
        run(str(bt/"zipalign"),"-f","-P","16","4",str(unaligned),str(apk))
        return apk
    apk=make()
    env={k:v for k,v in os.environ.items() if not k.startswith(("SECTOR_REBOUND_BETA_","SR_"))}
    env.update(GITHUB_REPOSITORY="EdenP-Development/Ricochet-Rumble",GITHUB_REF="refs/heads/main",GITHUB_EVENT_NAME="workflow_dispatch",GITHUB_SHA="0"*40,SR_OWNER_APPROVED="true",SR_RECOVERY_CONFIRMED="true",SR_EXPECTED_UNSIGNED_SHA=sha(apk),SR_VERSION_CODE="1",SR_VERSION_NAME="0.9.80-beta.1",SECTOR_REBOUND_BETA_KEYSTORE_BASE64=base64.b64encode(key.read_bytes()).decode(),SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD="fixture-only",SECTOR_REBOUND_BETA_KEY_ALIAS="fixture",SECTOR_REBOUND_BETA_KEY_PASSWORD="fixture-only")
    def check(name,source=fixture,input_apk=apk,changes=None,ok=False,expected=None):
        e=dict(env);e["SR_EXPECTED_UNSIGNED_SHA"]=sha(input_apk);e.update(changes or {})
        out=d/name
        result=run("bash",str(source),str(input_apk),str(out),env=e,ok=ok)
        if expected and expected not in result: raise ValueError("Wrong rejection reason: "+name+" "+result)
        if ok:
            if not (out/"Sector-Rebound-Beta-INTERNAL-REVIEW.apk").is_file(): raise ValueError("Missing fixture output")
        elif out.exists(): raise ValueError("Rejected input produced output")
        print("PASS",name)
        return out
    good=check("valid-fixture",ok=True)
    check("branch-denied",changes={"GITHUB_REF":"refs/heads/test"},expected="Trusted main")
    check("push-denied",changes={"GITHUB_EVENT_NAME":"push"},expected="Trusted main")
    check("approval-denied",changes={"SR_OWNER_APPROVED":"false"},expected="attestation required")
    check("recovery-denied",changes={"SR_RECOVERY_CONFIRMED":"false"},expected="attestation required")
    check("hash-denied",changes={"SR_EXPECTED_UNSIGNED_SHA":"f"*64})
    check("wrong-package",input_apk=make(package="com.example.wrong"))
    check("wrong-version",input_apk=make(version=2))
    check("debug-denied",input_apk=make(debug=True),expected="Refusing debuggable")
    check("already-signed",input_apk=good/"Sector-Rebound-Beta-INTERNAL-REVIEW.apk",expected="Refusing already signed")
    # Real production copy still pins original cert: use actual expected package but disposable key.
    check("production-cert-denied",source=prod,input_apk=make(package="com.playereden.ricochetrumble.beta"),expected="Certificate mismatch")
    check("missing-secret",changes={"SECTOR_REBOUND_BETA_KEY_ALIAS":""},expected="Missing required secret name")
    print("SR_HUB_06_FIXTURE_PASS 12")
