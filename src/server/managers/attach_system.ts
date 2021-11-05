function serializeAttachments(attachments:number[])
{
	return (attachments.map((hash) => (hash.toString(36)))).join("|");
}

function _addAttachment(entity:PlayerMp, attachmentHash:number, remove:boolean)
{
	let idx = entity._attachments.indexOf(attachmentHash);
	
	if(idx === -1)
	{
		if(!remove)
		{
			entity._attachments.push(attachmentHash);
		}
	}
	else if(remove)
	{
		entity._attachments.splice(idx, 1);
	}
	
	entity.setVariable("attachmentsData", serializeAttachments(entity._attachments));
}

function _addAttachmentWrap(attachmentName:HashOrString, remove:boolean)
{
	if(typeof(attachmentName) === "number")
	{
		_addAttachment(this, attachmentName, remove);
	}
	else if(typeof(attachmentName) === "string")
	{
		_addAttachment(this, mp.joaat(attachmentName), remove);
	}
}

function _hasAttachment(attachmentName:HashOrString)
{
	return this._attachments.indexOf((typeof(attachmentName) === 'string') ? mp.joaat(attachmentName) : attachmentName) !== -1;
}

mp.events.add("playerJoin", (player:PlayerMp) =>
{
	player._attachments = [];	
	player.addAttachment = _addAttachmentWrap;
	player.hasAttachment = _hasAttachment;
});

mp.events.add("staticAttachments.Add", (player:PlayerMp, hash:string) => player.addAttachment(parseInt(hash, 36), false));
mp.events.add("staticAttachments.Remove", (player:PlayerMp, hash:string) => player.addAttachment(parseInt(hash, 36), true));