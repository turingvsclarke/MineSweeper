var mines=0;
var size=0;
var mineArray=[];

function printArray(){
    console.log("printing array");
    for(let i=0;i<size;i++){
        console.log(mineArray[i]);
    }
}

function gameSetup(event){
    event.preventDefault();
    mines=document.getElementById('mineSize').value;
    size=document.getElementById('boardSize').value;
    //alert(mines+" , "+size);
    
    mineArray=new Array(size);
    for(let i=0;i<size;i++){
        mineArray[i]=[];
        for(let j=0;j<size;j++){
            mineArray[i].push(0);
        }
    } // end for
    
   
    // Adding all the mines by inserting 0 at random points
    for(let i=0;i<mines;i++){
        // Create a random n
        let rand=Math.floor(Math.random()*size*size);
        // May want to use this while loop to make sure we're actually adding another zero
        
        while((mineArray[Math.floor(rand/size)][rand%size])==-1){
            rand=Math.floor(Math.random()*size*size);
        }
        mineArray[Math.floor(rand/size)][rand%size]=-1;
    } // end for

    printArray();
    
    // Increase the six entries around a mine by 1
    for(let x=0;x<size;x++){
        for(let y=0;y<size;y++){
            // See if the current entry is a mine
            if(mineArray[x][y]==-1){
                for(let i=-1;i<2;i++){
                    for(let j=-1;j<2;j++){
                        // Iterate through all of the six options around the mine that are valid array entries
                        if((x+i>=0)&&(x+i<size)&&(y+j>=0)&&(y+j<size)){
                            // Make sure that the option isn't a mine itself
                            if(mineArray[x+i][y+j]>-1){
                                mineArray[x+i][y+j]++;
                            }
                        }
                    }
                }
            }
        }
    }
    createBoard(size);
    printArray();
} // end gameSetup

function showInfo(id){
    
    let btn=document.getElementById(id);
    // Find out which button it was and replace the html of its parent with a number
    let arrEntry=parseInt(btn.value);
    if(arrEntry==-1){
        //btn.textContent="X";
        alert("You Lose!");
        // Refresh the page.
        document.getElementById('grid-container').innerHTML="";
        return;
    }else{

        if(arrEntry==0){
            explodeZeroes(id);
        }else{
            showValue(id);
        } 
    }
    
    let btns=[...document.getElementsByClassName('grid-item')];
    console.log(btns);
    // If the only buttons left are mines, end the game
    let minesLeft=btns.filter(b=>parseInt(b.value)!=-1);
    if(minesLeft.length==0){
        alert("You Win!");
        btns.filter(b=>minesLeft.indexOf(b)<0).map(b=>{
            showValue(b.id);
        });
        // Refresh the page.
        //document.getElementById('grid-container').innerHTML="";
        return;
    }
    
    //parent.style.padding="15px";
    
}

function showValue(id){
    let btn=document.getElementById(id);
    if(btn){
        // Find out which button it was and replace the html of its parent with a number
        let parent=document.getElementById("container-"+id);
        let arrEntry=parseInt(btn.value);
        if(arrEntry>-1){
            parent.innerHTML=arrEntry;
            parent.style.background="gray";
        }else{
            parent.innerHTML="X";
        }
        parent.style.border="solid blue .5px";
    }
}

function explodeZeroes(id){
    // If there's elements on all six sides, and they're zero, explode them too
    if(document.getElementById(id)&&document.getElementById(id).value==0){
        showValue(id);
        [-1,1].map(i=>{
            if((Math.floor((id+i)/size))==(Math.floor(id/size))){
                explodeZeroes(id+i);
            }
            if(((id+i*size)>=0)&&((id+i*size)<size*size)){
                explodeZeroes(id+i*size);
            }

        });
    }
}

function createBoard(size){
    let grid=document.getElementById('grid-container');
    grid.innerHTML="";
    let n=size;
    for(let i=0;i<n*n;i++){
        let arrEntry=mineArray[Math.floor(i/size)][i%size];
        grid.innerHTML+="<p class='gridParent' id=container-"+i+" name='"+i+"'><button class='grid-item' id="+i+" onclick='showInfo("+i+")' value="+arrEntry+">"+"</button></p>";
    }
    let str="";
    for(let i=0;i<n;i++){
    str+="auto ";
    }
    grid.style['grid-template-columns']=str;
    grid.style.width=(size*30).toString()+"px";
}

for(let i=0;i<size*size;i++){
    document.getElementById(i.toString()).addEventListener('click',showInfo);
}


document.getElementById('gameSettings').addEventListener('submit',gameSetup);