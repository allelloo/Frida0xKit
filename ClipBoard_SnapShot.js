
/*
 * Frida0xKit - Clipboard SnapShot - 0x007v - lol
 * Get the current Android clipboard content from the running application.
 * Uses ClipboardManager to retrieve the current Primary Clip.
 * Note: This is a one-time read, NOT a real-time clipboard monitor.
 */


setTimeout(function() {
    Java.perform(function() {
        Java.choose("android.content.ClipboardManager", {
            onMatch: function(instance) {               
                if (instance.toString().indexOf("android.content.ClipboardManager") >= 0) {
                    var ActivityThread = Java.use('android.app.ActivityThread');
                    var context = ActivityThread.currentApplication().getApplicationContext();
                    var ClipboardManager = Java.use("android.content.ClipboardManager");
                    var clipboardHandle = context.getSystemService("clipboard");
                    var cp = Java.cast(clipboardHandle, ClipboardManager);
                    var primaryClip = cp.getPrimaryClip(); // The result is returned as Android ClipData ... So we need to use toString()
                    if (primaryClip != null) {
                        console.log(primaryClip.toString()); 
                    }
                }
            },
            onComplete: function() {
                console.log(" L O L ");
            }

        });
    })

}, 1500)