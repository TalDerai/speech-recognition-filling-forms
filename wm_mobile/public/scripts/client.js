const API_PATH = 'https://kupaktana.com/api/' // temp
//const API_PATH = 'http://localhost:3009/api/'

// url rewrite for system messages
var uri = window.location.toString()
if (uri.indexOf("?") > -1) {
    var clean_uri = uri.replace('&msg=1', '').replace('&msg=0', '') //uri.substring(0, uri.indexOf("?"))
    //console.log(clean_uri)
    window.history.replaceState({}, document.title, clean_uri)
}

/* $(function(){
    var copyrightYear = document.getElementById('copyright-year');
        if(copyrightYear){
            var dteNow = new Date();
            const intYear = dteNow.getFullYear();
            copyrightYear.textContent = intYear;
        }
}) */

// worker photo
const uploadToServer = async (tp, id, file) => {
    try {
        const body = new FormData()
        body.append("file", file)
        const res = await fetch(`${API_PATH}file?tp=${tp}&id=${id}`, {
            //const res = await fetch(`/file?tp=${tp}&id=${id}`, {
            method: "POST",
            body
        })
        const result = await res.json()
        return result
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

const setImage = async () => {
    const [file] = wPicInput.files
    if (file) {
        $("#wPic").attr("src", URL.createObjectURL(file))
        const id = $('input[name="Id"]').val()
        uploadToServer('worker', id, file)
    }
}

const chooseImage = () => {
    $('#wPicInput')[0].click() //.trigger('click')
}

const chooseFile = () => {
    $('#wFileInput')[0].click() //.trigger('click')
}

const getEventFiles = async (id) => {
    const fUrl = `/eventFiles?id=${id}`
    const respF = await fetch(fUrl)
    const files = await respF.json()
    $("#sFileList").html(files.files)
}

const setFile = async () => {
    const [file] = wFileInput.files
    if (file) {
        const id = $('input[name="Id"]').val()
        await uploadToServer('event', id, file)
        await getEventFiles(id)
    }
}

const removeFile = async (event, id, eventId) => {
    event.cancelBubble = true
    event.preventDefault()
    event.stopPropagation()
    const res = await fetch(`${API_PATH}events/arcFile?id=${id}&arc=1`)
    const json = await res.json()
    console.log(json)
    await getEventFiles(eventId)
}

const runAction = async (text) => {
    const url = '/voiceAction'
    //console.log(30,text)
    const body = JSON.stringify({ text: text })
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    })
    return await resp.json()
}

// seach
let searchType = 'events'
const setType = (tp) => {
    searchType = tp
}

const searchByTypeAndKey = () => {
    event.preventDefault()
    const key = $("#inpSearch").val()
    if (key.trim() != "") {
        const type = $("#divSearchTabs").find(".bg-blue-dark").attr("data-tp")
        const url = `/search?type=${type}&key=${key}`
        document.location.assign(url)
    }
}

// report
//https://kupaktana.com/reports/report?desk=3&worker=0&type=0&category=0&from=1664571600000&to=1664688312056
let repType = 0, repDesk = 0, repFromDate = 0, repToDate = 0
const setRepType = (el) => {
    repType = $(el).attr('data-id')
    if (repType == 0)
        $('#secDeskChoice').show()
    else{
        $('#secDeskChoice').hide()
    }        

    const buttons = Array.from($('#repTypes').find('button'))
    buttons.forEach(item => {
        if ($(item).attr('data-id') == repType) {
            $(item).addClass('bg-blue-dark').removeClass('border-blue-dark color-blue-dark')            
        } else {
            $(item).addClass('border-blue-dark color-blue-dark').removeClass('bg-blue-dark')
        }
    })
}

const setRepDesk = (el) => {    
    repDesk = $(el).attr('data-id')
    let items = Array.from($('#menu-desk-switch-rep').find('a'))
    items.forEach(item => {
        if ($(item).attr('data-id') == repDesk) {
            $(item).find('i').addClass('color-red-light').removeClass('color-gray-dark')
            $('#repDeskName').text($(item).find('span').text())
        } else {
            $(item).find('i').addClass('color-gray-dark').removeClass('color-red-light')
        }
    })    
}

let repSelectedFrom = 'quarter'
const setRepPeriod = (el) =>{    
    repFromDate = $(el).attr('data-id')
    repSelectedFrom = $(el).attr('data-p')
    const buttons = Array.from($('#secPeriodChoice').find('button'))
    buttons.forEach(item => {
        if ($(item).attr('data-p') == repSelectedFrom) {
            $(item).addClass('bg-blue-dark').removeClass('border-blue-dark color-blue-dark')            
        } else {
            $(item).addClass('border-blue-dark color-blue-dark').removeClass('bg-blue-dark')
        }
    })
}

const createReport = () => {
    event.preventDefault()
    if(repFromDate == 0) repFromDate = $("#inpRepFromDate").val()
    if(repToDate == 0) repToDate = $("#inpRepToDate").val()
    if(repDesk == 0) repDesk = $("#inpRepDesk").val()
    const url = `https://kupaktana.com/reports/report?desk=${repDesk}&worker=0&type=${repType}&category=0&from=${repFromDate}&to=${repToDate}`
    console.log(url)
    window.open(url, '_blank')
}