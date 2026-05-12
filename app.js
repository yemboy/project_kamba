const STORAGE_KEY = 'kamba.tasks'
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

const backlogEl = document.getElementById('backlog')
const doingEl   = document.getElementById('doing')
const finishEl  = document.getElementById('finish')
const addBtn = document.getElementById('addBtn')
const newTitle = document.getElementById('newTitle')
const newColumn = document.getElementById('newColumn')

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7) }

function render(){
  [backlogEl, doingEl, finishEl].forEach(el=>el.innerHTML = '')
  tasks.forEach(t=>{
    const card = document.createElement('div')
    card.className = 'card'
    card.draggable = true
    card.dataset.id = t.id
    card.innerHTML = `<div>${escapeHtml(t.title)}</div>
                      <div class="meta"><span>${t.id}</span><button data-action="del">✕</button></div>`
    card.addEventListener('dragstart', onDragStart)
    card.addEventListener('dblclick', ()=>editTask(t.id))
    card.querySelector('button').addEventListener('click', ()=>deleteTask(t.id))
    const container = t.column === 'backlog' ? backlogEl : t.column === 'doing' ? doingEl : finishEl
    container.appendChild(card)
  })
}

function addTask(title, column){
  if(!title) return
  tasks.push({id:uid(), title:title.trim(), column})
  save(); render(); newTitle.value=''
}

function deleteTask(id){
  tasks = tasks.filter(t=>t.id!==id); save(); render()
}

function editTask(id){
  const t = tasks.find(x=>x.id===id)
  const newT = prompt('Editar tarea:', t.title)
  if(newT!=null){ t.title = newT.trim(); save(); render() }
}

/* Drag & Drop */
let draggedId = null
function onDragStart(e){
  draggedId = e.currentTarget.dataset.id
  e.dataTransfer.setData('text/plain', draggedId)
  e.currentTarget.classList.add('dragging')
}
;['backlog','doing','finish'].forEach(col=>{
  const el = document.getElementById(col)
  el.addEventListener('dragover', e=>{ e.preventDefault(); })
  el.addEventListener('drop', e=>{
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedId
    const t = tasks.find(x=>x.id===id)
    if(t){ t.column = col; save(); render() }
    draggedId = null
  })
})

addBtn.addEventListener('click', ()=>addTask(newTitle.value, newColumn.value))
newTitle.addEventListener('keydown', (e)=>{ if(e.key==='Enter') addTask(newTitle.value, newColumn.value) })

function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[c])) }

render()
