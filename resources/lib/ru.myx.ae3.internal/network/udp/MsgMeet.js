const MsgMeet = module.exports = require('ae3').Class.create(
	/* name */
	"MsgMeet",
	/* inherit */
	require('./Message').Request,
	/* constructor */
	function(){
		// this.MessageRequest();
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x6D // 'm'.charCodeAt(0)
		},
		serial : {
			value : 0x00FFFFF0
		},
		isUHP_FROM_SERVER : {
			value : true
		},
		isUHP : {
			value : true
		},
		isMEET : {
			value : true
		},
		build : {
			value : function(){
				return 0;
			}
		},
		toString : {
			value : function(){
				return "[MsgMeet]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(){
				return new MsgMeet();
			}
		},
		"toString" : {
			value : function(){
				return "MsgMeet";
			}
		}
	}
);
