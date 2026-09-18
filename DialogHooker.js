
/*
 * Frida0xKit - DialogHooker - 0x007v - lol
 * Advanced UI Interception Module
 * Purpose: Silently neutralizes restrictive modal overlays (e.g., integrity checks, mandatory prompts) 
 * by analyzing view hierarchies and terminating matching instances before user interaction.
 */


Java.performNow(function () {

    // Signatures that trigger immediate termination of the UI element
    const restrictedKeywords = new Set([
        "lol TEST",
        "rooting detected",
        "Detected!!!",
        "Hooking",
        "force update",
        "upgrade now",
        "buy now",
    ]);

    // Recursively traverses the view tree to harvest all visible string data
    function harvestTextNodes(uiElement) {
        const capturedStrings = [];
        try {
            const windowInstance = uiElement.getWindow();
            if (!windowInstance) return capturedStrings;
            
            const rootDecor = windowInstance.getDecorView();
            if (!rootDecor) return capturedStrings;

            const TextViewClass = Java.use("android.widget.TextView");
            const ViewGroupClass = Java.use("android.view.ViewGroup");

            function traverseNode(currentView) {
                try {
                    if (TextViewClass.class.isInstance(currentView)) {
                        const textObj = Java.cast(currentView, TextViewClass).getText();
                        if (textObj !== null) {
                            const cleanText = textObj.toString().trim();
                            if (cleanText.length > 0) {
                                capturedStrings.push(cleanText);
                            }
                        }
                    }
                    if (ViewGroupClass.class.isInstance(currentView)) {
                        const viewGroup = Java.cast(currentView, ViewGroupClass);
                        const childCount = viewGroup.getChildCount();
                        for (let idx = 0; idx < childCount; idx++) {
                            traverseNode(viewGroup.getChildAt(idx));
                        }
                    }
                } catch (err) {
                    console.error("[UI-Monitor] Exception during UI tree traversal:", err);
                }
            }

            traverseNode(rootDecor);
        } catch (err) {
            console.error("[UI-Monitor] Exception during UI tree traversal:", err);
        }
        return capturedStrings;
    }

    // Evaluates harvested strings against the restricted signatures
    function evaluateThreatLevel(stringArray) {
        const aggregatedContent = stringArray.join(" ").toLowerCase();
        for (const signature of restrictedKeywords) {
            if (aggregatedContent.indexOf(signature.toLowerCase()) !== -1) {
                return signature;
            }
        }
        return null;
    }

    // Main handler for intercepting and neutralizing target modals
    function neutralizePopup(targetInstance) {
        // Maintain a strong reference to prevent premature garbage collection
        const persistentRef = Java.retain(targetInstance);
        
        Java.scheduleOnMainThread(function () {
            try {
                const extractedData = harvestTextNodes(persistentRef);
                const triggerPhrase = evaluateThreatLevel(extractedData);
                
                if (triggerPhrase !== null) {
                    console.warn(`[UI-Monitor] Neutralized restrictive overlay. Trigger: '${triggerPhrase}' | Payload: ${JSON.stringify(extractedData)}`);
                    persistentRef.dismiss();
                } else {
                    console.log(`[UI-Monitor] Overlay passed validation. Allowing render. Payload: ${JSON.stringify(extractedData)}`);
                }
            } catch (err) {
                console.error("[UI-Monitor] Failure during overlay neutralization sequence:", err);
            }
        });
    }

    // Hook: Core Android Dialog
    try {
        const BaseDialog = Java.use("android.app.Dialog");
        BaseDialog.show.implementation = function () {
            console.debug("[Interceptor] Base Dialog rendering initiated");
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
            neutralizePopup(this);
        };
    } catch (err) {
        console.warn("[Interceptor] Core Dialog API unavailable or obfuscated");
    }

    // Hook: Standard AlertDialog
    try {
        const ClassicAlertDialog = Java.use("android.app.AlertDialog");
        ClassicAlertDialog.show.implementation = function () {
            console.debug("[Interceptor] Classic AlertDialog rendering initiated");
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
            neutralizePopup(this);
        };
    } catch (err) {
        console.warn("[Interceptor] Classic AlertDialog API unavailable or obfuscated");
    }

    // Hook: AndroidX AppCompat AlertDialog
    try {
        const AppCompatDialog = Java.use("androidx.appcompat.app.AlertDialog");
        AppCompatDialog.show.implementation = function () {
            console.debug("[Interceptor] AndroidX AppCompat AlertDialog rendering initiated");
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
            neutralizePopup(this);
        };
    } catch (err) {
        console.warn("[Interceptor] AndroidX AppCompat Dialog API unavailable or obfuscated");
    }

    // Hook: AndroidX DialogFragment
    try {
        const FragmentDialog = Java.use("androidx.fragment.app.DialogFragment");
        FragmentDialog.onCreateDialog.implementation = function (savedState) {
            console.debug("[Interceptor] AndroidX DialogFragment creation initiated");
            const generatedDialog = this.onCreateDialog(savedState);
            generatedDialog.setCancelable(true);
            generatedDialog.setCanceledOnTouchOutside(true);
            neutralizePopup(generatedDialog);
            return generatedDialog;
        };
    } catch (err) {
        console.warn("[Interceptor] AndroidX DialogFragment API unavailable or obfuscated");
    }

    // Hook:  V7 AlertDialog
    try {
        const LegacySupportDialog = Java.use("android.support.v7.app.AlertDialog");
        LegacySupportDialog.show.implementation = function () {
            console.debug("[Interceptor] Legacy Support V7 AlertDialog rendering initiated");
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
            neutralizePopup(this);
        };
    } catch (err) {
        console.warn("[Interceptor] Legacy Support V7 Dialog API unavailable or obfuscated");
    }

    // Hook: Material Components AlertDialog
    try {
        const MaterialDialog = Java.use("com.google.android.material.dialog.MaterialAlertDialog");
        MaterialDialog.show.implementation = function () {
            console.debug("[Interceptor] Material Design AlertDialog rendering initiated");
            this.show();
            this.setCancelable(true);
            this.setCanceledOnTouchOutside(true);
            neutralizePopup(this);
        };
    } catch (err) {
        console.warn("[Interceptor] Material Design Dialog API unavailable or obfuscated");
    }

});