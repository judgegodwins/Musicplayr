/***************************************************************************************************
 * Change the directory in the variable 'dir' in the chooseDir function to your target directory for audio files
 * Created by Judge Godwins
 ***************************************************************************************************/

var audio;

var count = 0;

var input = document.querySelector('#fileIn');

var musicArr = [] //Array of audio file links

var dir;

var currentQueued;
var queuedArr = []
function chooseDir() {

     var directory = prompt('Choose a folder to select songs from');
     dir = directory;
    if(!directory) {
        console.log('No directory');
        dir = 'C:/Users/USER/Music/';
    }else console.log(dir);
}

chooseDir()

function startPlay() {
    if($('#playlist').html().trim() != '') {
        if(audio) {
            if(audio.paused) {
                audio.play();
            }else{
                audio.pause();
            }
        } else  {
            play(count);
        }
        iconCheck();
    }

}

function listing() {

    for(let i = 0; i < musicArr.length; i++) {
        let f = musicArr[i].substring(musicArr[i].lastIndexOf('/')+1);
        
        $('ul').append(`<div class="sng"><li class="songs">${f}</li><p class="playnext">Play Next</p>
        </div>`)
    }
}


function previous() {
    if(audio) {
        audio.pause()
    }
    
    if(count <= 0) {
        count = musicArr.length-1;
    }else{
        count -= 1;
    }
    
    play(count)
}

function showP(counter, str) {
    if(!counter && str) $('#playing').html(str.substring(str.lastIndexOf('/')+1).replace(/%20/g, ' '));
    else if(!str && counter) {
        $('#playing').html(musicArr[counter].substring(musicArr[counter].lastIndexOf('/')+1).replace(/%20/g, ' '));
    } else {
        $('#playing').html(musicArr[count].substring(musicArr[count].lastIndexOf('/')+1).replace(/%20/g, ' '));
    }

}


function next() {
    if(audio) {
        audio.pause();
    }
    if(count == musicArr.length-1) {
        count = 0;
    }else{
        count += 1;
    }
    
    play(count)
    
}

function fastForward() {
    audio.currentTime += 1;
}

function fastBackward() {
    audio.currentTime -= 2;
}

function eraseArray() {
    musicArr = [];
    var list = document.querySelector('#playlist');
    let oldChild = document.querySelectorAll('.sng')
    oldChild.forEach((child) => {
        list.removeChild(child);
    })
}

function play(countee) {
    try {
        if (audio) {
            audio.pause();
        }
        audio = new Audio(musicArr[countee]);
        audio.play();
        showP(countee, null);
        iconCheck();

    } catch (err) {
        console.log(err)
        alert("Sorry the folder path is incorrect. Please change it.");
        chooseDir();
        eraseArray();
    }
   playAuto(countee)
}

function playByString(str) {
    audio = new Audio(str);
    audio.play()
    showP(null, str);
    playAuto(count)
}

function addListener() {
    
    let li = document.querySelectorAll('li');
    for(let i = 0; i < li.length; i++) {
        li[i].addEventListener('click', () => {
            let f = dir +  li[i].innerHTML;
            let h = f.replace(/&amp;/gi, '&')

            count = musicArr.indexOf(h);
            play(count);

        })

        li[i].addEventListener('auxclick', (e) => {
            e.preventDefault()
            var playN = li[i].nextSibling;
            playN.classList.toggle('show');

            document.addEventListener('click', () => {
                playN.classList.remove('show');
            })

            $(playN).on('click', () => {
                let fc = dir +  li[i].innerText;
                queuedArr.push(fc);
            })

        })
    }
}
addListener();

function cut(str) {
    var m, fm;
    m = str.substring(str.lastIndexOf('/')+1);
    fm = m.replace(/%20/gi, ' ');
    return fm;
}

function addNew() {
    var file, s;
    
    if(input.files.length > 0) {
        
        for(let i = 0; i < input.files.length; i++) {

            if(input.files[i].type == 'audio/mp3' || input.files[i].type == 'video/mp4' || input.files[i].type == 'audio/x-m4a') {
                file = dir + input.files[i]['name'];

                if(musicArr.indexOf(file) < 0) {

                    musicArr.push(file);
                    s = cut(file);
                    $('ul').append(`<div class="sng"><li class="songs">${s}</li><p class="playnext">Play Next</p>
                    </div>`);
                    
                } else {
                    alert(`${cut(file)} is already in playlist!`);
                }
            } else {
                alert(`${input.files[i].name} is not an audio or video file.`);
            }
            
        }
        addListener();
        playAuto();
    }else{
        pop();
    }
    input.value = null;
}


function playAuto(counter) {
    if(audio) {
        audio.addEventListener('ended', function() {

            if(queuedArr[0]) {
                playByString(queuedArr.shift());
            } else {
                if(counter == musicArr.length-1) {
                    counter = 0;
                    count = counter;
                }else{
                    count = counter + 1;
                }
                play(count);
            }
        })
    }
}

$('.fwd').on('keydown', (e) => {
    if(e.keyCode == 13) {
        fastForward();
    }
})

$('.bwd').on('keydown', (e) => {
    if(e.keyCode == 13) {
        fastBackward()
    }
})

//Keyboard shortcuts
document.addEventListener('keydown', (e) => {

    switch(e.keyCode) {
        case 118:
            addNew();
        break;
        case 113:
            startPlay();
        break;
        case 119:
            previous();
        break;
        case 120:
            next();
        break;
    }
    if(e.keyCode == 17) {
        document.addEventListener('keydown', checkRemove, false);
        function listenKey() {
            document.removeEventListener('keydown', checkRemove, false);
        }
        setTimeout(listenKey, 800);
    }
    function checkRemove(e) {
        if(e.keyCode == 77) {
            fastForward();
            document.removeEventListener('keydown', checkRemove, false);
        }
        if(e.keyCode == 66) {
            fastBackward();
        }
        for(let i = 0; i < musicArr.length+1; i++) {
            
            if(e.keyCode == i.toString().charCodeAt(0)) {
                e.preventDefault()
                count = i-1;
                
                if(audio) {
                    audio.pause()
                }
                audio = new Audio(musicArr[count]);
                audio.play();
                document.removeEventListener('keydown', checkRemove, false);
            }
        }
        showP();
        iconCheck();
    }
    
});

var btn = document.querySelector(".save-btn");
btn.addEventListener("click", function(){
    if(musicArr.length > 0){
        localStorage.setItem("playlist", musicArr.join('[---]'));
    }
});

window.addEventListener("load", function(){
    var opinion = confirm('Do you want to get your last saved songs?');
    if(opinion) {
        if(localStorage.getItem('playlist') == null) {
            alert('Sorry, no saved songs')
            return;
        }
        var playlistStr = localStorage.getItem('playlist')
        musicArr = playlistStr.split('[---]');
        listing();
        addListener();
    }
});

// function delComma(str) {
//     var gs;
//     for(let i = 0; i < str.length; i++) {
//         var gs;
//         if(str[i] == ',' ) {
//             if(str[i+1] != 'C') {
//                 console.log("This is it: " + str[i] + ' ' + str[i+2] + '%' + str.indexOf(str[i]));
//                 gs = str.replace(str[i], '%');
//             }
//         }
//     }
//     return gs;
// }

// function find() {
//     for(let i = 0; i < musicArr.length; i++) {
//         if(musicArr[i][0] !== 'C') {
//             console.log(musicArr[i]);
//         }
//     }
// }
