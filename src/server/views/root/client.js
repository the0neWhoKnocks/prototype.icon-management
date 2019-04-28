function onYouTubeIframeAPIReady() {
  let partying = false;
  let timeCheck;
  
  const enableParty = () => {
    partying = true;
    document.body.classList.add('party-time');
  };
  const disableParty = () => {
    clearInterval(timeCheck);
    partying = false;
    document.body.classList.remove('party-time');
  };
  const handleTimeChange = () => {
    const time = player.getCurrentTime();
    
    if(time >= 99.5){
      if(!partying) enableParty();
      else if(time >= 108) disableParty();
    }
  };
  
  const player = new YT.Player('player', {
    width: '560',
    height: '315',
    videoId: 'gAYL5H46QnQ',
    playerVars: { start: 93 },
    events: {
      onStateChange: (ev) => {
        switch(ev.data){
          case YT.PlayerState.PLAYING:
            clearInterval(timeCheck);
            handleTimeChange();
            timeCheck = setInterval(handleTimeChange, 10);
            break;
          
          case YT.PlayerState.PAUSED:
            disableParty();
            break;
        }
      }
    }
  });
}