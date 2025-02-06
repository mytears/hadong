let m_status_time_chk = 0;
let m_time_last = 0;
let m_contents_url = "";
let m_root_url = "";
let m_notice_mode = "";
let m_header = null;
let m_contents_list = [[], [], [], []];

let m_curr_notice = 1;
let m_curr_notice_ptime = 0;
let m_curr_notice_type = "";
let m_curr_notice_cnt = -1;
let m_notice_timeout = null;
let m_admin_timeout;
let m_curr_video_zone = null;
let m_showInnerTimer;
let m_logo_url = "";
let m_curr_admin = 1;

let m_curr_page = "";
let m_clickable = true;
let m_curr_playing = null;
let m_sound_volume = 1.0;

function setInit() {

    /*
    $(".cup_img").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCup(this);        
    });
    */

    $(".page_00 .cup_zone").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCup(this);
    });

    $(".page_10 .main_menu").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    $(".home_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickHomeBtn(this);
    });

    $(".close_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickCloseBtn(this);
    });

    $(".pos_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickPopupBtn(this);
    });

    $("html").on("touchstart mousedown", function (e) {
        e.preventDefault();
        setTouched();
        setTouchSoundPlay();
    });

    m_time_last = new Date().getTime();
    setInterval(setMainInterval, 1000);
    setLoadSetting("include/setting.json");
    setInitFsCommand();
}

function setTouchSoundPlay(){
    setSoundPlay(m_header.touch_sound);
}

function setLoadSetting(_url) {
    $.ajax({
        url: _url,
        dataType: 'json',
        success: function (data) {
            m_contents_url = data.setting.content_url;
            m_root_url = data.setting.root_url;
            m_notice_mode = data.notice_mode;
            setContents();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}

//메인 타이머
function setMainInterval() {
    var time_gap = 0;
    var time_curr = new Date().getTime();

    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
    if (time_gap > 180) {
        if ($(".page_00").css("display") == "none") {
            setMainReset();
        }
    }

    m_status_time_chk += 1;
    if (m_status_time_chk > 60) {
        m_status_time_chk = 0;
        setCallWebToApp('STATUS', 'STATUS');
    }
}

function setTouched() {
    m_time_last = new Date().getTime();
}


//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_contents_list = convCate(data.contents_list);
            //            setShowPopup(0, 0);
            //setTimeout(setHideCover, 500);
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
            setInitSetting();
            //setTimeout(setHideCover, 500);
        },
    });
}

function convCate(_list) {
    let t_list = [[], [], [], []];

    for (var i = 0; i < _list.length; i += 1) {
        t_list[_list[i].cate].push(_list[i]);
    }
    //console.log(t_list);
    return t_list;
}

//로딩 커버 가리기
function setHideCover() {
    if ($(".cover").css("display") != "none") {
        $('.cover').hide();
    }
}

//초기화
function setInitSetting() {
    $(".popup_page").hide();
    $(".page_20").hide();
    $(".page_10").hide();
    $(".cate_00").hide();
    $(".cate_01").hide();
    $(".cate_02").hide();
    $(".cate_03").hide();
    
    setTimeout(setHideCover, 500);
    //m_curr_page = ".page_00";
    setPage("00");
}

function setMainReset() {
    m_clickable = true;

    $(".page_00 .cup_img").removeClass("pause");
    $(".page_00 .cup_img").css("opacity","1");
    $(".page_00 .cup_img").css("top","740px");
    $(".page_00 .cup_img").css("left","720px");
    $(".page_00 .cup_wave").show();
    $(".page_00 .cup_txt").show();


    $(".page_10 .cup_img").removeClass("pause");
    $(".page_10 .cup_img").css("opacity","1");
    $(".page_10 .cup_img").css("top","620px");
    $(".page_10 .cup_img").css("left","700px");
    $(".page_10 .cup_wave").show();



    setPage("00");
}

function setShowPopup(_cate, _num) {
    m_clickable = true;
    $(".txt_title").html("");
    $(".txt_desc").html("");
    $(".txt_address").html("");
    $(".txt_tel").html("");
    $(".txt_programs").html("");
    $(".img_0").attr("src", "");
    $(".img_1").attr("src", "");
    $(".img_2").attr("src", "");


    let t_contents = m_contents_list[_cate][_num];

    $(".txt_title").html(t_contents.name);
    $(".txt_desc").html(t_contents.desc);
    $(".txt_address").html(t_contents.address);
    $(".txt_tel").html(t_contents.tel);
    $(".txt_programs").html(t_contents.programs);
    $(".img_0").attr("src", t_contents.main_img_url);
    $(".img_1").attr("src", t_contents.sub_img_url);
    $(".img_2").attr("src", t_contents.qr_img_url);
    $(".popup_page").show();


    gsap.fromTo(".popup_area", {
        top: "151px",
        opacity: 0.25
    }, {
        top: "201px",
        duration: 0.5,
        opacity: 1,
        ease: "back.out"
    });

}

function setHidePopup() {
    m_clickable = true;
    $(".popup_page").fadeOut();
}

function onClickHomeBtn(_obj) {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    //setMainReset();
    setPage("10");
}

function onClickPopupBtn(_obj) {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    let t_code = $(_obj).attr("code");
    //console.log(t_code);
    let t_cate = parseInt(t_code.substr(0, 1));
    let t_page = parseInt(t_code.substr(1, 1));
    let t_idx = parseInt(t_code.substr(2, 1));
    setShowPopup(t_cate, t_page * 4 + t_idx);
}

function onClickCloseBtn(_obj) {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    setHidePopup();
}

function onClickCup(_obj) {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    //$(_obj).addClass("pause").animate({ top: "-=100px", left:"+=100px", opacity: 0 }, 3000);
    $(".page_00 .cup_img").addClass("pause").animate({
        top: "-=10px",
        left: "+=20px",
        opacity: 0
    }, 500);
    $(".page_00 .cup_wave").fadeOut();
    $(".page_00 .cup_txt").fadeOut();

    setTimeout(setPage, 250, "10");
}

function onClickMainMenu(_obj) {
    if (m_clickable == false) {
        return;
    }
    m_clickable = false;
    let t_code = $(_obj).attr('code');
    //setPage("2"+t_code);
    $(".page_10 .cup_img").addClass("pause").animate({
        top: "-=30px",
        left: "-=10px",
        opacity: 0
    }, 500);
    $(".page_10 .cup_wave").fadeOut();


    setTimeout(setPage, 250, "2" + t_code);

}

function setPage(_code) {
    console.log('index setPage', _code);
    switch (_code) {
        case "00":
            setSwap(m_curr_page, ".page_00");
            break;
        case "10":
            $(".page_10 .cup_img").removeClass("pause");
            $(".page_10 .cup_img").css("opacity","1");
            $(".page_10 .cup_img").css("top","620px");
            $(".page_10 .cup_img").css("left","700px");
            $(".page_10 .cup_wave").show();
            
            
            setSwap(m_curr_page, ".page_10");
            break;
        case "20":
            $("#id_title_0").html("전통다도 여행");
            $("#id_title_1").html("하동의 전통적 다실 방문 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "21":
            $("#id_title_0").html("자연 속 힐링<br>다실 여행");
            $("#id_title_1").html("지리산 풍경과 섬진강이 어우러진<br>자연 풍경 속다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "22":
            $("#id_title_0").html("현대 감각 다실<br>여행");
            $("#id_title_1").html("젊은 감각의 현대적 다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
        case "23":
            $("#id_title_0").html("다실에서 머무는<br>휴식 여행");
            $("#id_title_1").html("여유를 즐기며 다숙이 가능한 다실 코스");
            setSwap(m_curr_page, ".page_20");
            setCate(_code);
            break;
    }
}

function setCate(_code) {

    let t_show = "";

    $(".cate_00").hide();
    $(".cate_01").hide();
    $(".cate_02").hide();
    $(".cate_03").hide();
    switch (_code) {
        case "20":
            t_show = ".cate_00";
            break;
        case "21":
            t_show = ".cate_01";
            break;
        case "22":
            t_show = ".cate_02";
            break;
        case "23":
            t_show = ".cate_03";
            break;
    }
    $(t_show).show();
    gsap.fromTo(t_show + " .page_bg", {
        top: "50px"
    }, {
        top: "0px",
        duration: 0.5,
        ease: "power2.out"
    });
}

function setSwap(_hide, _show) {
    m_curr_page = _show;
    $(_show).css("z-index", "100");
    $(_show).fadeIn(1000);
    if ($(_show + " .page_bg").length > 0) {
        gsap.fromTo(_show + " .page_bg", {
            top: "50px"
        }, {
            top: "0px",
            duration: 0.5,
            ease: "power2.out"
        });
    }
    //console.log(_hide);
    if (_hide != "") {
        $(_hide).css("z-index", "90");
        setTimeout(setHide, 1000, _hide);
    } else {
        m_clickable = true;
    }
}

function setHide(_hide) {
    m_clickable = true;
    $(_hide).hide();
}

function setSoundPlay(_sound) {
    //console.log(_sound);
    /*
    if (m_curr_playing) {
        m_curr_playing.pause(); // 이전 오디오 중지
        m_curr_playing.currentTime = 0; // Reset time
    }
    */
    m_curr_playing = new Audio(_sound);
    //m_curr_playing.volume = m_sound_volume;
    m_curr_playing.play();
    /*
    setTimeout(function () {
        m_curr_playing.play();
    }, 0);
    */
}








function getAdminVideoCode(_code) {
    for (var i = 0; i < m_admin_video_list.length; i += 1) {
        if (_code.toString() == m_admin_video_list[i].code.toString()) {
            return m_admin_video_list[i];
        }
    }
}

function getVideoCode(_code) {
    for (var i = 0; i < m_main_video_list.length; i += 1) {
        if (_code.toString() == m_main_video_list[i].code.toString()) {
            return m_main_video_list[i];
        }
    }
}

function convMainVideoList(_list) {
    let t_list = [];
    for (var i = 0; i < _list.length; i += 1) {
        if (i < m_pos_list.length) {
            t_list.push(_list[i]);
        }
    }
    return t_list;
}


function getTimeCheck(_json) {

    const date = new Date();
    const i_date = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const i_time = date.getHours() * 100 + date.getMinutes();

    const i_sday = parseInt(_json.sday);
    const i_eday = parseInt(_json.eday);
    const i_stime = parseInt(_json.stime);
    const i_etime = parseInt(_json.etime);

    if (i_sday <= i_date && i_eday >= i_date) {
        if (i_stime <= i_time && i_etime >= i_time) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function setNoticeDrawInfo() {
    m_curr_video_zone = null;
    var str_type = '';
    var str_show = '',
        str_hide = '';
    if (m_notice_list.length == 0) return;

    m_curr_notice_cnt++;
    if (m_curr_notice_cnt >= m_notice_list.length) m_curr_notice_cnt = 0;

    var obj = m_notice_list[m_curr_notice_cnt];

    if (getTimeCheck(obj) == false) {
        setNoticeDrawInfo();
        return;
    }
    console.log("setNoticeDrawInfo", obj.id, m_curr_notice, obj.type);

    if (m_curr_notice == 1) {
        m_curr_notice = 2;
        str_show = 'id_notice_box_02';
        str_hide = 'id_notice_box_01';
        $('#id_notice_box_01').css('zIndex', 9);
        $('#id_notice_box_02').css('zIndex', 10);
    } else {
        m_curr_notice = 1;
        str_show = 'id_notice_box_01';
        str_hide = 'id_notice_box_02';
        $('#id_notice_box_01').css('zIndex', 10);
        $('#id_notice_box_02').css('zIndex', 9);
    }

    m_curr_notice_type = obj.type;
    if (obj.type == "MOV") {
        $('#' + str_show + ' > video').attr('src', convFilePath(obj.file_url));
        $('#' + str_show + ' > video').show();
        $('#' + str_show + ' > img').hide();
        $('#' + str_show).children('video')[0].play();
        setAllVideoMute();
        setCallWebToApp("UNMUTE", $('#' + str_show).children('video').attr("id"));
        //setCallWebToApp("UNMUTE", "UNMUTE");
    } else if (obj.type == "IMG") {
        $('#' + str_show + ' > img').attr('src', convFilePath(obj.file_url));
        $('#' + str_show + ' > video').hide();
        $('#' + str_show).children('video')[0].pause();
        $('#' + str_show + ' > img').show();
    }
    m_curr_notice_ptime = parseInt(obj.ptime);
    if (m_curr_notice_ptime < 5) m_curr_notice_ptime = 5;
    m_curr_notice_ptime = m_curr_notice_ptime * 1000;
    clearTimeout(m_notice_timeout);
    m_notice_timeout = setTimeout(setMainTimeOut, m_curr_notice_ptime);
    setTimeout(setNoticeDrawInfoEnd, 10);
}

function setNoticeVideoStop() {
    console.log("setNoticeVideoStop");
    try {
        $("#id_notice_box_01").children("video")[0].pause();
    } catch (err) {}
    try {
        $("#id_notice_box_02").children("video")[0].pause();
    } catch (err) {}
    clearTimeout(m_notice_timeout);
}

function setMainTimeOut() {
    if ($('#id_main_screen_0').css('display') == 'none') {
        return;
    } else {
        setNoticeDrawInfo();
    }
}

function setNoticeDrawInfoEnd() {
    if (m_notice_list.length == 1) {
        if (m_curr_notice == 1) {
            $('#id_notice_box_01').fadeIn();
            setTimeout(setHideNotice, 500, '#id_notice_box_02');
        } else {
            $('#id_notice_box_02').fadeIn();
            setTimeout(setHideNotice, 500, '#id_notice_box_01');
        }
    } else {
        if (m_curr_notice == 1) {
            $('#id_notice_box_01').fadeIn();
            setTimeout(setHideNotice, 500, '#id_notice_box_02');
        } else {
            $('#id_notice_box_02').fadeIn();
            setTimeout(setHideNotice, 500, '#id_notice_box_01');
        }
    }
}

function setHideNotice(_str) {
    console.log(_str);
    $(_str).hide();
}

function setAllVideoMute() {
    console.log("setAllVideoMute");
    $('video').each(function () {
        $(this).prop('muted', true);
    });
}

function setVideoStart() {
    //"START"
    setAllVideoMute();
    setAllVideoPause();
    setTimeout(setOthersVideoClear, 500);
    m_curr_video_zone = null;
    let t_video_zone = null;
    let t_video = null;
    $(".admin_video_page").fadeOut(1000);
    if (m_main_video_list.length > 0) {
        for (var i = 0; i < m_main_video_list.length; i += 1) {
            t_video = $(".video_page .video_zone[code='" + i + "'] video");
            t_video_zone = $(".video_page .video_zone[code='" + i + "']");

            let src = $(t_video).attr("src");
            if (!src) {
                t_video.attr('src', convFilePath(getVideoCode(i).file_url));
            }
            if (t_video[0].paused) {
                t_video[0].play();
            }
            t_video_zone.css("top", m_pos_list[i].y);
            t_video_zone.css("left", m_pos_list[i].x);
            t_video_zone.css("width", 688);
            t_video_zone.css("height", 556);
        }
        $(".video_page .image_zone[code='5']").css("top", m_pos_list[5].y);
        $(".video_page .image_zone[code='5']").css("left", m_pos_list[5].x);
    }
    $(".video_page").fadeIn(1000);
}

function setCommand(_str) {
    console.log("setCommand", _str);
    let t_list = _str.split("|");
    let cmd = t_list[0];
    let arg = t_list[1];
    if (cmd.toUpperCase() == "START") {
        setNoticeVideoStop();
        $(".notice_main").fadeOut(1000);
        setVideoStart();
    } else if (cmd.toUpperCase() == "PLAY") {
        setVideoListPlay(arg);
    } else if (cmd.toUpperCase() == "STOP") {
        setVideoListStop(arg);
    } else if (cmd.toUpperCase() == "ADMIN_START") {
        setAdminModeStart(arg);
    } else if (cmd.toUpperCase() == "ADMIN_PLAY") {
        setAdminVideoPlay(arg);
    } else if (cmd.toUpperCase() == "PAUSE") {
        setVideoListPause(arg);
    } else if (cmd.toUpperCase() == "RESUME") {
        setVideoListResume(arg);
    } else if (cmd.toUpperCase() == "RESET") {
        setMainReset();
    }
}

function setVideoListStop(_code) {
    console.log("setVideoListStop", _code);
    if (m_curr_video_zone != null) {
        setAllVideoMute();
        let t_code = m_curr_video_zone.attr("code");
        if (t_code != undefined) {
            m_curr_video_zone.css("z-index", "15");
            let t_temp_video_zone = m_curr_video_zone;
            gsap.fromTo(
                m_curr_video_zone, {}, {
                    duration: 0.5,
                    top: m_pos_list[t_code].y,
                    left: m_pos_list[t_code].x,
                    width: 688,
                    height: 556,
                    ease: 'power2.inOut',
                    onComplete: function () {
                        t_temp_video_zone.css("z-index", "10");
                    }
                }
            );
            m_curr_video_zone = null;
        }
    }
    if (m_main_video_list.length > 0) {
        for (var i = 0; i < m_main_video_list.length; i += 1) {
            $(".video_page .video_zone[code='" + i + "'] video")[0].play();
        }
    }
}

function setAdminModeStart(_arg) {
    //admin_start
    console.log("setAdminModeStart", _arg);
    $(".admin_video_page").stop(true, true);
    if ($(".notice_main").css('display') != 'none') {
        setTimeout(setNoticeVideoStop, 1000);
        $(".notice_main").fadeOut(1000);
        $(".admin_video_page").show();
        $(".admin_video_page .video_zone").hide();
    } else if ($(".admin_video_page").css('display') != 'none') {
        setAllVideoPause();
        $(".admin_video_page .video_zone").fadeOut();
        $("#id_admin_box_img").show();
    } else {
        $(".video_page").fadeOut(1000);
        setAllVideoMute();
        setAllVideoPause();
        $(".admin_video_page video").attr('src', "");
        $(".admin_video_page").show();
        $(".admin_video_page .video_zone").hide();
        $("#id_admin_box_img").hide();
        $("#id_admin_box_img").fadeIn(1000);
    }
}

function setAllMainVideoRemove() {

    if (m_main_video_list.length > 0) {
        for (var i = 0; i < m_main_video_list.length; i += 1) {
            t_video = $(".video_page .video_zone[code='" + i + "'] video");
            t_video_zone = $(".video_page .video_zone[code='" + i + "']");
            t_video[0].src = "";
            t_video[0].load();
        }
    }
}

function setAllVideoPause() {
    console.log("setAllVideoPause");
    let videos = $("video");
    videos.each(function () {
        const video = this;
        video.pause();
    });
}

function setAllVideoClear() {
    console.log("setAllVideoClear");
    let videos = $("video");
    videos.each(function () {
        const video = this;
        video.src = '';
        video.load();
    });
}

function setOthersVideoClear() {
    console.log("setOthersVideoClear");
    $("#id_notice_video_1")[0].src = "";
    $("#id_notice_video_2")[0].src = "";
    $("#id_admin_video_1")[0].src = "";
    $("#id_admin_video_2")[0].src = "";
}

function setMainVideoClear() {
    console.log("setMainVideoClear");
    $("#id_main_video_0")[0].src = "";
    $("#id_main_video_1")[0].src = "";
    $("#id_main_video_2")[0].src = "";
    $("#id_main_video_3")[0].src = "";
    $("#id_main_video_4")[0].src = "";
}

function setShowInnerBorder() {
    console.log("setShowInnerBorder");
    $(".inner_border").show();
}

function setVideoListResume(_code) {
    console.log("setVideoListResume");
    if (m_curr_video_zone != null) {
        $(m_curr_video_zone).find("video")[0].play();
    }
}

function setVideoListPause(_code) {
    console.log("setVideoListPause");
    if (m_curr_video_zone != null) {
        $(m_curr_video_zone).find("video")[0].pause();
    }
}

function setAdminVideoPlay(_code) {
    //"admin_play"
    console.log("setAdminVideoPlay", _code);
    if (getAdminVideoCode(_code) == undefined) {
        return;
    }

    var str_show = '',
        str_hide = '';

    $(".admin_video_page").stop(true, true);
    if ($(".notice_main").css('display') != 'none') {
        $("#id_admin_box_img").hide();
        setTimeout(setNoticeVideoStop, 1000);
        $(".notice_main").fadeOut(1000);
        $(".admin_video_page").show();
    } else if ($(".video_page").css('display') != 'none') {
        $("#id_admin_box_img").hide();
        $(".admin_video_page").show();
        $(".video_page").fadeOut(1000);
    } else {
        $(".admin_video_page").show(1000);
    }

    if (m_curr_admin == 1) {
        m_curr_admin = 2;
        str_show = 'id_admin_box_02';
        str_hide = 'id_admin_box_01';
        $('#id_admin_box_02').css('zIndex', 10);
        $('#id_admin_box_01').css('zIndex', 9);
    } else {
        m_curr_admin = 1;
        str_show = 'id_admin_box_01';
        str_hide = 'id_admin_box_02';
        $('#id_admin_box_01').css('zIndex', 10);
        $('#id_admin_box_02').css('zIndex', 9);
    }


    if (m_main_video_list.length > 0) {
        setAllVideoMute();
        setAllVideoPause();
        setTimeout(setMainVideoClear, 500);
        //setAllMainVideoRemove();
    }


    //$('#' + str_show).children('video')[0].load(convFilePath(getAdminVideoCode(_code).file_url));

    $('#' + str_show + ' > video').attr('src', convFilePath(getAdminVideoCode(_code).file_url));
    //$('#' + str_show).children('video')[0].play();
    $('#' + str_show).fadeIn();
    setCallWebToApp("UNMUTE", $('#' + str_show).children('video').attr("id"));

    let t_str = str_hide;
    if ($('#' + t_str + ' > video')[0].currentSrc) {
        $('#' + t_str + ' > video')[0].pause();
    }
    clearTimeout(m_admin_timeout);
    m_admin_timeout = setTimeout(function () {
        $('#' + t_str).hide();
        $('#' + t_str + ' > video').attr('src', "");
    }, 500);
}

function setVideoListPlay(_code) {
    console.log("setVideoListPlay", _code);

    if ($(".notice_main").css('display') != 'none') {
        setNoticeVideoStop();
        $(".notice_main").fadeOut(1000);
    }

    $(".video_page").stop(true, true);
    $(".video_page").fadeIn(1000);
    if (_code == "all") {
        setAllVideoPositionReset();
        if ($('.admin_video_page').css('display') != 'none') {
            setAllVideoPause();
            $(".admin_video_page").fadeOut(1000);
            setTimeout(function () {
                $('.admin_video_page video').attr('src', "");
            }, 1000);
        }
        m_curr_video_zone = null;
    } else {
        if ($('.admin_video_page').css('display') != 'none') {
            setAllVideoPause();
            $(".admin_video_page").fadeOut(1000);
            setTimeout(function () {
                $('.admin_video_page video').attr('src', "");
            }, 1000);
        }
        if (m_main_video_list.length > 0) {
            setAllVideoPause();
        }
        if (m_curr_video_zone != null) {
            setVideoListStop("");
        }
        m_curr_video_zone = $(".video_page .video_zone[code='" + _code + "']");
        if (m_curr_video_zone[0] == undefined) {
            m_curr_video_zone = null;

            if (m_main_video_list.length > 0) {
                for (var i = 0; i < m_main_video_list.length; i += 1) {
                    $(".video_page .video_zone[code='" + i + "'] video")[0].play();
                }
            }
            return;
        }
        m_curr_video_zone.css("z-index", "20");
        m_curr_video_zone.find("video")[0].play();
        setAllVideoMute();
        setCallWebToApp("UNMUTE", m_curr_video_zone.children('video').attr("id"));
        gsap.fromTo(
            m_curr_video_zone, {}, // 시작값
            {
                duration: 0.5,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                ease: 'power2.inOut',
                onComplete: function () {
                    m_curr_video_zone.css("z-index", "20");
                }
            }
        );
    }
}

function setAllVideoPositionReset() {
    let t_video_zone = null;
    for (var i = 0; i < m_main_video_list.length; i += 1) {
        t_video_zone = $(".video_page .video_zone[code='" + i + "']");
        t_video_zone.css("z-index", "10");
        t_video_zone.css("top", m_pos_list[i].y);
        t_video_zone.css("left", m_pos_list[i].x);
        t_video_zone.css("width", 688);
        t_video_zone.css("height", 556);
    }
    //setShowInnerBorder();
}

function setInitFsCommand() {
    if (window.chrome.webview) {
        window.chrome.webview.addEventListener('message', (arg) => {
            console.log(arg.data);
            setCommand(arg.data);
        });
    }
}

function onClickDebug() {
    setCommand($(".input_zone").val());
    $(".input_zone").val("");
}
