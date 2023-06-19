const runExe = async (text) => {    
    $("#monitor").text(text)
    const result = await runAction(text)

    if (result.action != 'na') {
        const url = (result.action.indexOf('http')>-1 ? '' : document.location.origin) + result.action

        $("#result").text(url)
        console.log(url)        

        if (action.indexOf('/reports/') > -1) {
            const url1 = `https://kupaktana.com${url}`
            window.open(url1, '_blank')
        } else {
            document.location.assign(url)
        }
    } else {
        $("#result").text('השאילתה לא ברורה, אנא נסה שוב ועיין בדפי העזרה')
    }
}

const clickRecButton = () => {
    $('.App div button').eq(0).trigger('click')
}

$(function () {
    var res = $('.App div h2').eq(0)
    let button = $('.App div button').eq(0)
    $(button).addClass('btn mt-3 font-32 rounded-m btn-primary')
    var isRec = $('.App div h3').eq(0)    
    isRec.bind("DOMSubtreeModified", function () {
        if (isRec.text() === '1') {
            $(button).addClass('btn-danger').removeClass('btn-primary')
        } else {
            $(button).addClass('btn-primary').removeClass('btn-danger')
            runExe(res.text().trim())
        }
    })

    // custom events for menu-sound show/hide
    const $div = $('#menu-sound')
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const isOpened = $(mutation.target).prop(mutation.attributeName).indexOf('menu-active')>-1
            const isRec = $('.App div h3').eq(0).text() === '1'
            
            /* if(isOpened && !isRec){
                clickRecButton()
            }else  */
            if(!isOpened && isRec){
                clickRecButton()
            }
            //console.log("Sound recorder is opened:", isOpened)
            //console.log("Running:", isRec)            
        })
    })

    observer.observe($div[0], {
        attributes: true,
        attributeFilter: ['class']
    })
   
})

