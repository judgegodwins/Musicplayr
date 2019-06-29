/***************************************************************************************************
 * Change the directory in the variable 'file' in addNew() to your target directory for audio files
 ***************************************************************************************************/

var audio;

var count = 0;

var input = document.querySelector('#fileIn');

var musicArr = [
    'C:/Users/USER/Music/15. XXXTENTACION & Lil Pump - Arms Around You (feat. Maluma & Swae Lee) - (SongsLover.com).mp3',
    'C:/Users/USER/Music/Dua Lipa - Favorite Problem (CDQ) - (SongsLover.com).mp3',
    'C:/Users/USER/Music/Dynoro_and_Gigi_D_Agostino_-_In_My_Mind_.mp3'
] //Array of audio file links


function play() {
    if(audio) {
        if(audio.paused) {
            audio.play();
        }else{
            audio.pause();
        }
    } else  {
        audio = new Audio(musicArr[count])
        audio.play();
    }
    iconCheck()
    console.clear();
}

function listing() {

    for(let i = 0; i < musicArr.length; i++) {
        let f = musicArr[i].substring(musicArr[i].lastIndexOf('/')+1);
        
        $('ul').append(`<li class="songs">${f}</li>`)
    }
}
listing()

function previous() {
    if(audio) {
        audio.pause()
    }
    
    if(count <= 0) {
        count = musicArr.length-1;
    }else{
        count -= 1;
    }
    
    console.log(count)
    audio = new Audio(musicArr[count]);
    showP();
    audio.play();
    iconCheck();
    showP();
}

function showP() {

    $('#playing').html(musicArr[count].substring(musicArr[count].lastIndexOf('/')+1).replace(/%20/g, ' '));

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
    
    audio = new Audio(musicArr[count])
    audio.play();
    
    iconCheck();
    showP()
    
}

function fastForward() {
    audio.currentTime += 1;
}

function fastBackward() {
    audio.currentTime -= 2;
}

function addListener() {
    
    let li = document.querySelectorAll('li');
    for(let i = 0; i < li.length; i++) {
        li[i].addEventListener('click', () => {
            let f = 'C:/Users/USER/Music/' +  li[i].innerHTML;
            console.log(f)
            let h = f.replace(/&amp;/gi, '&')
            console.log(h)
            count = musicArr.indexOf(h)
            if(audio) {
                audio.pause()
            }
            audio = new Audio(musicArr[count])
            audio.play();
            iconCheck();
            showP();
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
    
    if(input.files.length >= 1) {
        
        for(let i = 0; i < input.files.length; i++) {
            file = 'C:/Users/USER/Music/'+ input.files[i]['name'];
            console.log(musicArr.indexOf(file));
            if(musicArr.indexOf(file) < 0) {

                musicArr.push(file);
                s = cut(file);
                $('ul').append(`<li class="songs">${s}</li>`);
                
            } else {
                alert(`${cut(file)} is already in playlist!`);
            }
            
        }
        addListener();
    }else{
        pop();
    }
    input.value = null;
}


function playAuto() {
    if(audio.currentTime == audio.duration) {
        if(count == musicArr.length-1) {
            count = 0
        }else{
            count += 1
        }
        
        audio = new Audio(musicArr[count]);
        audio.play()
        showP()
    }
}

//Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    
    switch(e.keyCode) {
        case 118:
            addNew();
        break;
        case 113:
            play();
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

setInterval(playAuto, 1000);