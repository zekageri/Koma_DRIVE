var Notify = function(message,title,type,timer){
    var enteranim,exitanim;
    if(type == "warning" || type == "danger"){
       enteranim = 'animated bounceIn';
       exitanim = 'animated bounceOut';
    }else{
        enteranim = 'animated fadeInDown';
        exitanim = 'animated fadeOutRight';
    }
    $.notify({
        title: '<strong>'+title+'</strong><br>',
        message: message,
        icon: 'glyphicon glyphicon-ok',
        target: '_blank'
    },{
        element: 'body',
        type: type,
        showProgressbar: false,
        placement: {from: "top",align: "right"},
        offset: 0,
        spacing: 20,
        z_index: 1031,
        delay: 3300,
        timer: timer,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: enteranim,
            exit: exitanim
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
    });
}