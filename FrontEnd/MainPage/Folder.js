var Drive = {};
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
            //console.log(Drive);
        }

        function OpenFolder(Folder){
            console.log("Opening Folder: ", Folder);
            Notify(Folder,"Opening Folder...","warning",1500);
        }
        function Generate_Folder(FolderName,FileCount){
            if(FolderName == "drive"){
                FolderName = "Gyökér Mappa";
            }
            var $LI = $("<li>",{class:"folders"});
            var $A  = $("<a>",{href:"#",title:"#",class:"folders", onclick:"OpenFolder('"+FolderName+"')"});
            var $ICON = $("<span>",{class:"filesicon folder full",});
            var $NAME = $("<span>",{class:"name",text:FolderName});
            var $Files = $("<span>",{class:"details",text:FileCount});
            
                $A.append($ICON);
                $A.append($NAME);
                $A.append($Files);
                $LI.append($A);
                $("#folderholder").append($LI);
        }

        function Get_DriveFolders(){
            $.get( "/GetFolders", function( data ) {
                Tear_Down_URLs(data);
                for (const [key, value] of Object.entries(Drive)) {
                    Generate_Folder(key,Drive[key].length);
                }
            });
        }

        function Folder_Things(){
            $('.btn-group-fab').on('click', '.btn', function() {
                $('.btn-group-fab').toggleClass('active');
                if($(this).prop("title") == "Create"){
                    $('#CreateFolderModal').modal();
                }
            });
            $('has-tooltip').tooltip();
        }      