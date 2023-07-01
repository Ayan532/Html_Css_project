let addbtn = document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn")
let modalCont = document.querySelector(".modal-cont");
let mainCont=document.querySelector(".main-cont")
let textareaCont=document.querySelector(".textarea-cont")
let allPriorityColor=document.querySelectorAll(".priority-color")
let toolBoxColors=document.querySelectorAll(".color");
let colors=["lightpink","lightblue","lightgreen","black"];
let modelPriorityColor=colors[colors.length-1]
let addFlag = false;
let removeFlag= false;

let lockClass="fa-lock";
let unlockClass="fa-lock-open";

let ticketArr=[]
if(localStorage.getItem("Ticket")){
  //retrive and display tickets
  ticketArr=JSON.parse(localStorage.getItem("Ticket"));
  ticketArr.forEach((ticketObj)=>{
    createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
  })

}
for(let i=0;i<toolBoxColors.length;i++)
{ 
  toolBoxColors[i].addEventListener("click",(e)=>{
    let currToolBoxColor=toolBoxColors[i].classList[0];
      let filteredticket=ticketArr.filter((ticketObj,idx)=>{
         return currToolBoxColor===ticketObj.ticketColor;
      })
      //REMOVE Ticktes 
      let allTicketCont=document.querySelectorAll(".ticket-cont");
      for(let i=0;i<allTicketCont.length;i++){
        allTicketCont[i].remove()
      }

      //Displa new Filterd ticktes;
      filteredticket.forEach((ticketObj,idx)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);

      })
  })
   toolBoxColors[i].addEventListener("dblclick",(e)=>{
    let allTicketCont=document.querySelectorAll(".ticket-cont");
    for(let i=0;i<allTicketCont.length;i++){
      allTicketCont[i].remove()
    }
    ticketArr.forEach((ticketObj,idx)=>{
      createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
    })
   })
  
}

//Listener of Modal priority coloring
//Toggling of colors in Modal

allPriorityColor.forEach((coolorElem,idx)=>{
  coolorElem.addEventListener("click",(e)=>{
    allPriorityColor.forEach((priorityColorElem,idx)=>{
      priorityColorElem.classList.remove("border");
    })
    coolorElem.classList.add("border");
    modelPriorityColor=coolorElem.classList[0];

  })
})

addbtn.addEventListener("click", (e) => {
  //Display Modal
  //Generate icket

  //AddFlag=True->Modal Display
  //AddFlag=false->Modal hide

  addFlag = !addFlag;
  if (addFlag) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});
removebtn.addEventListener("click",(e)=>{
  //Only To Toggle the Remove btn
  removeFlag=!removeFlag;
 

})
modalCont.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==='Shift')
    {
        createTicket(modelPriorityColor,textareaCont.value);
    
        addFlag=false;
    
        setModalToDeafault();//to remove the textarea after creating ticket
    }
})

function createTicket(ticketColor,ticketTask,ticketId) {
  let id= ticketId ||  shortid();
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"</div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
  </div>

    `;
  mainCont.appendChild(ticketCont);
   //create Obj of ticket and add to arrray
   if(!ticketId){
       ticketArr.push({ticketColor,ticketTask,ticketId:id});
        localStorage.setItem("Ticket",JSON.stringify(ticketArr));
      }
   handleRemover(ticketCont,id);
   handleLock(ticketCont,id);
   handleColor(ticketCont,id);
}
function handleColor(ticket,id){
  let ticketColor=ticket.querySelector(".ticket-color");
   ticketColor.addEventListener("click",(e)=>{
     //get tickets from the ticket array
     let TicketIDx=getTicket(id);
     let currticketColor=ticketColor.classList[1];
     //Ticket Color index
     let currentTicketColorinx=colors.findIndex((color)=>{
        return currticketColor===color;
     })
     currentTicketColorinx++;
     let newTicketColoridx=currentTicketColorinx % colors.length;
     let newTicketColor=colors[newTicketColoridx];
     ticketColor.classList.remove(currticketColor);
     ticketColor.classList.add(newTicketColor);
     //Modify data in Local Storage

     ticketArr[TicketIDx].ticketColor=newTicketColor;
     localStorage.setItem("Ticket",JSON.stringify(ticketArr));

   })
}
function getTicket(id){
  let ticketsIdx=ticketArr.findIndex((ticketObj)=>{
    return ticketObj.ticketId===id;
  })
  return ticketsIdx;

}

function handleRemover(ticket,id){
   ticket.addEventListener("click",(e)=>{
     if(!removeFlag){
       return;
      }
      let idx =getTicket(id);
       ticketArr.splice(idx,1);//removing 1 ele
       let strTicketArr=JSON.stringify(ticketArr);
       localStorage.setItem("Ticket",strTicketArr);
       
       ticket.remove();//UI removal
      })

}
function handleLock(ticket,id){
  let ticketLockElem=ticket.querySelector(".ticket-lock");
   let ticketLock=ticketLockElem.children[0];
   let ticketTaskArea=ticket.querySelector(".task-area")
   ticketLock.addEventListener("click",(e)=>{
     let ticketIdx=getTicket(id);
      if(ticketLock.classList.contains(lockClass))
      {
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskArea.setAttribute("contenteditable","true")//to edit
      }
      else{
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute("contenteditable","false")//now we cant edit
         localStorage.setItem("Ticket",JSON.stringify(ticketArr));

      }
      //Modify Data In local Storage(Ticket Task)
    ticketArr[ticketIdx].ticketTask=ticketTaskArea.innerText;
    localStorage.setItem("Ticket",JSON.stringify(ticketArr));

   })
}
function setModalToDeafault(){
  modalCont.style.display = "none";
  textareaCont.value="";
  modelPriorityColor=colors[colors.length-1];
  allPriorityColor.forEach((priorityColorElem,idx)=>{
    priorityColorElem.classList.remove("border");
  })
  allPriorityColor[allPriorityColor.length-1].classList.add("border");
}