/*
 * Frida0xKit - Clipboard Monitor - 0x007v - lol
 * Monitors clipboard updates made through ClipboardManager.setPrimaryClip().
 * Prints the new ClipData whenever the target application updates the clipboard.
 * Note: This monitors setPrimaryClip() calls inside the hooked application.
 */

Java.perform(function () {
    const ClipboardManager = Java.use("android.content.ClipboardManager");

    ClipboardManager.setPrimaryClip.overload(
        "android.content.ClipData"
    ).implementation = function (clipData) {

        console.log("\n========== CLIPBOARD CHANGED ==========");

        if (clipData) {
            console.log(clipData.toString());
        } else {
            console.log("ClipData: null");
        }

        console.log("=======================================\n");

        return this.setPrimaryClip(clipData);
    };

    console.log("[+] Clipboard setPrimaryClip hooked");
});