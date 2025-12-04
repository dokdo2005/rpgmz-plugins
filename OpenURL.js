/*:
 * @target MZ
 * @command OpenURL
 * @text Open URL
 * @desc Opens a webpage in the default browser.
 *
 * @arg url
 * @text URL
 * @desc The web address to open.
 * @type string
 */

(() => {
    const pluginName = "OpenURL";

    PluginManager.registerCommand(pluginName, "OpenURL", args => {
        const url = args.url;
        
        if (window.require) {
            // For desktop (NW.js)
            require('nw.gui').Shell.openExternal(url);
        } else {
            // For browser
            window.open(url, "_blank");
        }
    });
})();
