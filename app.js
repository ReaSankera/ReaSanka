const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const package = require("./package.json");
const image = require("./image.json")
const updates = require("./updates.json")

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot launched.... with ${client.guilds.size} servers and with ${client.users.size} user`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`Type !!helpah | Server: ${client.guilds.size} | User: ${client.users.size}`);
  //Sets username on all servers
  client.user.setUsername(config.username);
});

// Set the bot's online/idle/dnd/invisible status
client.on("ready", () => {
    client.user.setStatus("dnd");
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`Type !!helpah | Server: ${client.guilds.size} | User: ${client.users.size}`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`Type !!helpah | Server: ${client.guilds.size} | User: ${client.users.size}`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  //Server Commands
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }


  //Owner Commands
  

  //Kick
  if(command === "pussy") {
  
    if(message.author.id !== config.ownerID) 
    if(message.author.id !== config.zaniID)
      return message.reply("Sorry, not for people like you :p ");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  } 
  //Ban
  if(command === "ass") {
    if(message.author.id !== config.ownerID) 
    if(message.author.id !== config.zaniID) 
        return message.reply("Sorry, not for people like you :p ");
      
      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  
      let reason = args.slice(1).join(' ');
      if(!reason)
        return message.reply("Please indicate a reason for the ban!");
      
      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  if  (message.content.startsWith(config.prefix + "owner")) {
    
    if(message.author.id !== config.ownerID) 
    return message.reply("Sorry, not for people like you :p ");

    message.channel.send(updates.updateowner)
  }
});
//Commands
client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.content.startsWith(config.prefix + "helpah")) {
    message.channel.send(`This is fun bot and not more bot.More options will be added soon.Type "!!commands" for the commands with prefix, be sure to check "!!update"`);
  } else
  if (message.content.startsWith(config.prefix + "inv")) {
    message.channel.send("My invite linke so you can add me on your server :heart: https://discordapp.com/oauth2/authorize?client_id=393920096860635136&scope=bot&permissions=1 .My invite linke to my server :purple_heart:  https://discord.gg/f3cdMz5");
  } else
  if (message.content.startsWith(config.prefix + "commands")) {
    message.channel.send("Commands with prefix:help,report,inv,ping,say,kick,ban,purge,guilds,pat,kiss,slap,butts,lewd,fuck,life,kill");
  } else
    if (message.content.startsWith(config.prefix + "guilds")) {
      message.channel.send(`The bot sees ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  } else
  if (message.content.startsWith(config.prefix + "report")) {
    message.channel.send("If you have something to report, write it my owner ReaSanka#6146 (just dm the owner if you see something is not working or any grammer mistakes)")
  } else 
  if  (message.content.startsWith(config.prefix + "update")) {
    message.channel.send(updates.update)
  } else 
  if (message.content.startsWith(config.prefix + "pat")) {
  
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant pat yourself do you?(please mention someone)");
     

       message.channel.send(config.pat +  member.user.tag + image.pat);
  }
  if (message.content.startsWith(config.prefix + "butts")) {

    return message.reply(image.butts)
  }
  if (message.content.startsWith(config.prefix + "kiss")) {
  
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant kiss yourself do you?(please mention someone)");
     

       message.channel.send(message.author + config.kiss +  member.user.tag + image.kiss);
  }
  if (message.content.startsWith(config.prefix + "slap")) {
  
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant slap yourself do you?(please mention someone)");
     

       message.channel.send(message.author + config.slap +  member.user.tag + image.slap);
  }

  if (message.content.startsWith(config.prefix + "lewd")) {

    return message.reply(config.lewd + image.lewd)
  }

  if (message.content.startsWith(config.prefix + "life")) {

    return message.reply(config.life + image.life)
  }

  if (message.content.startsWith(config.prefix + "fuck")) {

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant fuck yourself do you?(please mention someone)");

    return message.reply(config.fuck + member.user.tag + image.fuck)
  }

  if (message.content.startsWith(config.prefix + "dickslap")) {

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant dickslap yourself do you?(please mention someone)");

    return message.reply("*gives* " + member.user.tag + config.dickslap  + image.dickslap + " (i dont know why i even made this) " )
  }
  if (message.content.startsWith(config.prefix + "kill")) {

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you can kill yourself?(please mention someone)");

    return message.reply(config.kill  + member.user.tag + image.kill)
  }
  if (message.content.startsWith(config.prefix + "rape")) {

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("you cant rape yourself do you???(please mention someone)");

    return message.reply(config.rape  + member.user.tag + image.rape+ " (this i actually a gif from a hentai :shrug: )")
  }
  if (message.content.startsWith(config.prefix + "cry")) {

    return message.reply(config.cry + image.cry)
  }
//Help commands
if (message.content.startsWith(config.prefix + "help inv")) {
  message.channel.send("with inv you get an inv link from me and my server :smile: ");
} else
if (message.content.startsWith(config.prefix + "help commands")) {
  message.channel.send("with commands you see how many commands i have :3 ");
} else
  if (message.content.startsWith(config.prefix + "help guilds")) {
    message.channel.send(`this shows how many channel,user is see and i how many server i got invited`);
} else
if (message.content.startsWith(config.prefix + "help report")) {
  message.channel.send("this will give you my owners discord name if i am drunk")
} else 
if  (message.content.startsWith(config.prefix + "help update")) {
  message.channel.send("this will show you what got update in the past hours or days")
} else 
if (message.content.startsWith(config.prefix + "help pat")) {

     message.channel.send("this will pat someone but dont forgett to mention him");
} else
if (message.content.startsWith(config.prefix + "help butts")) {

  message.channel.send("this will give a nice anime ass gif")
} else
if (message.content.startsWith(config.prefix + "help kiss")) {

     message.channel.send("this will kiss someone but dont forgett to mention him");
} else
if (message.content.startsWith(config.prefix + "help slap")) {   

  message.channel.send("this will slap if you dont like him/her or he/she was mean but dont forgett to mention him");
} else

if (message.content.startsWith(config.prefix + "help lewd")) {

  message.channel.send("ill give you a lewd pic but dont ask for more :p ")
} else

if (message.content.startsWith(config.prefix + "help life")) {

  message.channel.send("you can see here how my life is right now")
} else

if (message.content.startsWith(config.prefix + "help fuck")) {

  message.channel.send("you can fuck someone if you want :shrug: ")
}
if (message.content.startsWith(config.prefix + "help kill")) {

  message.channel.send("you can kill someone if you want")
}
if (message.content.startsWith(config.prefix + "help dickslap")) {

  message.channel.send("you can dickslap someone if you want")
}
if (message.content.startsWith(config.prefix + "help rape")) {

  message.channel.send("you can actually rape someone isnt that great?")
}

});
//Message.Reply

client.on ("message", (message) => { 

     if(message.content == "prefix") {
        // message.reply ("info");
         message.channel.sendMessage("Prefix is !!");
     }

     if(message.content == "bots dont have feelings") {
      // message.reply ("info");
       message.channel.sendMessage(`We have feelings too :cry: `);
   }
     
     if(message.content == "Haywood") {
        // message.reply ("info");
         message.channel.sendMessage("He's gone :cry: ");
    
     }       

     if(message.content == "Heil Alex") {
        // message.reply ("info");
         message.channel.sendMessage("**Heil Alex!**");
    
     } 
     
     if(message.content == "ly") {
        // message.reply ("info");
         message.channel.sendMessage("dont cheat on me");
    
     }    
    
     if(message.content == "Heil Alex") {
        // message.reply ("info");
         message.channel.sendMessage("**Heil Alex!**");
    
     } 
    
     if(message.content == "Hentai") {
        // message.reply ("info");
        message.channel.sendMessage("Hentai is for people without a gf or bf...oh shit who am i to say that *SEES THAT HE'S A BOT*");
    
     } 
    
    if(message.content == "Magey Mage") {
    //message.reply
    message.channel.sendMessage(`bots dont dislike you :heart: `);
  
    }


     if(message.content == "Alex") {
        // message.reply ("info");
         message.channel.sendMessage("Alex is the best person ever seen :heart: ");
    
     }
    
    if(message.content == "Good Morning") {
            // message.reply ("Good Morning");
             message.channel.sendMessage("Good Morning how are you doing?");
    }
    if(message.content == "Good morning") {
        // message.reply ("Good Morning");
         message.channel.sendMessage("Good Morning how are you doing?");
    }
    if(message.content == "good morning") {
        // message.reply ("Good Morning");
         message.channel.sendMessage("Good Morning how are you doing?");
    }
    if(message.content == "Im good and you?") {
        // message.reply ("Im good and you?");
         message.channel.sendMessage("Im doing fine :D ");
    
    }
    if(message.content == "good and you?") {
        // message.reply ("Im good and you?");
         message.channel.sendMessage("Im doing fine :D ");
    
    }
    if(message.content == "Im fine") {
        // message.reply ("Im good and you?");
         message.channel.sendMessage("I dont care :heart: ");
    
    }
    if(message.content == "im fine") {
        // message.reply ("Im good and you?");
         message.channel.sendMessage("I dont care :heart: ");
    
    }
    if(message.content == "im stupid") {
        // message.reply ("Im good and you?");
         message.channel.sendMessage("your not stupid your just special :smile: ");
    
    }

}); 

//eval code
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

//eval command 
client.on("message", message => {
  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith(config.prefix + "eval")) {
    if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
});
client.login(process.env.SECRET);
