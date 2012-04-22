// This isn't being used until I can figure out how to do it right.

// Application launch, enabled after being disabled or upgraded
function startup(data, reason)
{
    if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0) {
	Components.manager.addBootstrappedManifestLocation(params.installPath);
    }
}

// Application quitting, extension about to be disabled or upgraded
function shutdown(data, reason)
{
    if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0) {
	Components.manager
	    .removeBootstrappedManifestLocation(params.installPath);  
    }
}

// Before first call to startup()
function install(data, reason)
{
}

// After shutdown() during uninstall
function uninstall(data, reason)
{
}
