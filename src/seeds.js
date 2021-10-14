const mongoose = require('mongoose')
const Comment = require('./models/comment')
const Game = require('./models/game')
const Post = require('./models/post')
const Tag = require('./models/Tag')

var dummy_games = [
    {
        name: "League of Legends",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg",
    }, 
    {
        name: "Call of Duty: Warzone",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/Call%20of%20Duty:%20Warzone-285x380.jpg",
    },
    {
        name: "Valorant",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg",
    },
    {
        name: "Battlefield: 2042",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/Battlefield%202042-285x380.jpg",
    }
];

var dummy_posts = [
    {
        title: "New team mate",
        description: "We need a new member to be part of our gang for the summer",
    },
    {
        title: "Competing for Gold",
        description: "We want to train as much as possible to level up and get better perks like new weapons"
    }
];

var dummy_tags = [
    {
        name: "1v1"
    },
    {
        name: "Battle Royale"
    },
    {
        name: "Capture The Flag"
    },
    {
        name: "Ranking"
    },
    {
        name: "Team Battle"
    }
];

function emtpyDB() {
    Game.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("------ Games removed ------");
        }
    });
    Comment.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("------ Comments removed ------");
        }
    });

    Tag.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("------ Tags removed ------");
        }
    });

    Post.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("------ Posts removed ------");
        }
    });
  
    return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 500);
      });
};

async function seedDB(){
    const result = await emtpyDB();

    dummy_games.forEach(function(seed){
        Game.create(seed, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Added new game.");
            }
        });
    });


//     dummy_tags.forEach(function(seed){
//         Tag.create(seed, function(err){
//             if(err){
//                 console.log(err);
//             }else{
//                 console.log("Added new tag.");
//             }
//         });
//     });
// }

    var currTag = 0
    dummy_posts.forEach(function(seed){
        Post.create(seed, function(err, post){
            if(err){
                console.log(err);
            }else{
                console.log("Added new post");
                Comment.create({
                    text: "I would like to apply!"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    }else{
                        post.comments.push(comment);
                        // post.save();
                        console.log("Added new comment.");
                        Tag.create(dummy_tags[currTag], function(err, tag){
                            if(err){
                                console.log(err);
                            }else{
                                post.tags.push(tag);
                                post.save();
                                console.log("Added new tag.");
                                currTag+= 1;
                                // console.log(currTag);
                            }
                        });
                    }
                });
            }
        });
    });
};

module.exports = seedDB;