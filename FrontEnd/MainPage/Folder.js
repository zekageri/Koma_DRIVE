    var Drive = {};
    var FileURL = "/Multi_FileUploads";
        function Is_File(name){
            if(name.includes(".")){
                return true;
            }else{
                return false;
            }
        }

        function Is_Folder_Exist(folder){
            if(folder in Drive){
                return true;
            }else{
                return false;
            }
        }
        function Tear_Down_URLs(urls){
            for(var i = 0; i < urls.length; i++){
                var Splitted = urls[i].split("\\");
                var Last = Splitted[Splitted.length - 1];
                var Folder = Splitted[Splitted.length - 2];
                if( Is_File(Last) ){
                    if(Is_Folder_Exist(Folder)){
                        Drive[Folder].push(Last);
                    }else{
                        Drive[Folder] = new Array();
                        Drive[Folder].push(Last);
                    }
                }else{
                    if( !Is_Folder_Exist(Last) ){
                        Drive[Last] = new Array();
                    }
                }
            }
            console.log(Drive);
        }

        function GetBackToFolders(){
            $(".filemanager").show();
            $(".OpenedFolder").hide();
        }
        function OpenFolder(Folder){
            Notify(Folder,"Mappa megnyitása...","warning",500);
            $("#FolderNameOpened").text(Folder);
            $(".filemanager").hide();
            $(".OpenedFolder").show();
            Populate_Folder_With_Files(Folder);
            Populate_Carousel(Folder);
        }

        function OwlBox_Init(){
            $('.owl-carousel').owlCarousel({
                stagePadding: 50,
                loop:true,
                margin:10,
                items:3,
                nav:true,
                dots:false,
                autoplay:true,
                autoplayTimeout:1500,
                autoplayHoverPause:true,
                responsiveClass:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:5
                    }
                }
            });
        }

        function Get_Extension(File){
            var Splitted = File.split(".");
            return Splitted[Splitted.length - 1];
        }
        var Allowed_Image_Extensions = ["jpg","jpeg","png",""];
        function Populate_Carousel(Folder){
            $("#OwlBox").empty();
            $('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            $('.owl-carousel').find('.owl-stage-outer').children().unwrap();
            if(Folder in Drive){
                if(Drive[Folder].length > 0){
                    var $OWLDIV = $("<div>",{class:"owl-carousel owl-theme"}); 
                    for(var i = 0; i < Drive[Folder].length;i++){
                        if(Allowed_Image_Extensions.includes( Get_Extension(Drive[Folder][i]) )){
                            var $DIV = $("<div>",{class:"item"});
                            var $IMG = $("<img>",{style:"max-width:150px;max-height:200px;",src:Folder+"/"+Drive[Folder][i], class:"img-fluid"});
                            $DIV.append($IMG);
                            $OWLDIV.append($DIV);
                            $("#OwlBox").append($OWLDIV);
                        }
                    }
                    OwlBox_Init();
                }
            }
        }

        function Big_Div_Event() {
            $('.IMG__link').click(function () {
                var imgurl = $(this).prop("src");
                var src = imgurl.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                var modal;
                function removeModal() { modal.remove(); $('body').off('keyup.modal-close'); }
                modal = $('<div>').css({
                    background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
                    backgroundSize: 'contain',
                    width: '100%', height: '100%',
                    position: 'fixed',
                    zIndex: '10000',
                    top: '0', left: '0',
                    cursor: 'zoom-out'
                }).click(function () {
                    removeModal();
                }).appendTo('body');
                //handling ESC
                $('body').on('keyup.modal-close', function (e) {
                    if (e.key === 'Escape') { removeModal(); }
                });
            });
        }

        function Populate_Folder_With_Files(Folder){
            $("#Next_Folder_Content").empty();
            if(Folder in Drive){
                for(var i = 0; i < Drive[Folder].length;i++){
                    var $COL = $("<div>",{class:"col d-flex justify-content-center"});
                    if(Allowed_Image_Extensions.includes( Get_Extension(Drive[Folder][i]) )){
                        var $IMG = $("<img>",{src:Folder+"/"+Drive[Folder][i], class:"IMG__link img-fluid",style:"margin:10px;max-width:150px;"});
                        $COL.append($IMG);
                    }else{

                    }
                    $("#Next_Folder_Content").append($COL);
                }
            }
            Big_Div_Event();
        }

        var SelectedFolder = "";
        function SelectFolder(Folder){
            SelectedFolder = Folder;
            Notify("","Kiválasztott Mappa: " + SelectedFolder,"success",1500);
        }
        function Generate_Folder(FolderName,FileCount){
            if(FolderName == "drive"){
                FolderName = "Gyökér Mappa";
            }
            var $LI = $("<li>",{class:"folders"});
            var $A  = $("<a>",{href:"#",title:FolderName,class:"folders", onclick:"OpenFolder('"+FolderName+"')"}); //ondblclick:"OpenFolder('"+FolderName+"')"
            var $ICON = $("<span>",{class:"filesicon folder full",});
            var $NAME = $("<span>",{class:"name",text:FolderName});
            var $Files = $("<span>",{class:"details",text:FileCount});
            
                $A.append($ICON);
                $A.append($NAME);
                $A.append($Files);
                $LI.append($A);
                $("#folderholder").append($LI);
        }

        function Fill_Folder_Select_on_Upload(FolderName){
            //<option value="1">One</option>
            var $Option = $("<option>",{value:FolderName,text:FolderName});
            $("#FolderSelect").append($Option);
        }
        function Get_DriveFolders(){
            $.get( "/GetFolders", function( data ) {
                Tear_Down_URLs(data);
                if(data.length > 0){
                    $("#folderholder").html("");
                    for (const [key, value] of Object.entries(Drive)) {
                        Generate_Folder(key,Drive[key].length);
                        Fill_Folder_Select_on_Upload(key);
                    }
                }else{
                    $(".nothingfound").show();
                }
            });
        }

        function Upload_Checkbox_Change(){
            $( "#multiupload" ).change(function() {
                //console.log("Single Upload: ", $("#singleupload").prop("checked") );
                //console.log("Multi Upload: ", $("#multiupload").prop("checked") );
                $("#singlefileupload").hide();
                FileURL = "/Multi_FileUploads";
            });
            $( "#singleupload" ).change(function() {
                //console.log("Single Upload: ", $("#singleupload").prop("checked") );
                //console.log("Multi Upload: ", $("#multiupload").prop("checked") );
                $("#singlefileupload").show();
                FileURL = "/Single_FileUploads";
            });
        }
        function Folder_Things(){
            $('.btn-group-fab').on('click', '.btn', function() {
                $('.btn-group-fab').toggleClass('active');
                if($(this).prop("title") == "Create"){
                    $('#CreateFolderModal').modal();
                }else if($(this).prop("title") == "Upload"){
                    $("#UploadFileModal").modal();
                }
            });
            $('has-tooltip').tooltip();
        }      