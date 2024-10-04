console.log('desde public')


document.addEventListener('click', e=>{
    
 
    if(e.target.dataset.short){
        const url = `${window.location.origin}/${e.target.dataset.short}`
    
        navigator.clipboard
            .writeText(url)
            .then(()=>{
                console.log('teefef', e.target.dataset.short)
            })
            .catch((err)=>{
                console.log('hay un error', err)
            })
    }
})