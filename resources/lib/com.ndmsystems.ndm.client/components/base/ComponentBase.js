const ae3 = require("ae3");

/* TODO: configurable this.client.REGISTRATION_INTERVAL_SETTINGS */
const ComponentBase = module.exports = ae3.Class.create(
	"ComponentBase",
	require("./../AbstractComponent"),
	function(client){
		this.AbstractComponent.call(this, client);
		return this;
	},
	{
		componentName : {
			value : "base"
		},
		acceptXmlNotifications : {
			value : ['nr1','cs2','dr1','au1','fu2']
		},
		
		requestXmlNotifications : {
			get : function(){
				if(this.nextRendezvous <= Date.now()){
					return null;
				}
				return this.acceptXmlNotifications;
			}
		},
		
		onXmlNotification : {
			value : function(id, data){
				switch(id){
					case "nr1":
						return;
						return CLIENT_ON_UPDATE_RANDEZVOUS_XNS_FN.call(this.client, id, data);
					case "cs2":
						return;
						return CLIENT_ON_UPDATE_SETTINGS_XNS_FN.call(this.client, id, data);
				}
				return;
			}
		},
		
		nextRendezvous : {
			/**
			 * date: the date then next rendezvous is scheduled
			 */
			value : new Date(0)
		},
		
		
		lastRendezvous : {
			/**
			 * { date : , args : }
			 */
			value : null
		},
	},
	{
		newInstance : {
			value : function(client){
				return new ComponentBase(client);
			}
		}
	}
);
