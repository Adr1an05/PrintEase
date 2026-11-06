const $=id=>document.getElementById(id);
const app=$("app"), auth=$("authScreen");
let mode="login";

function toast(msg){const t=$("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2500)}
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.querySelectorAll(".nav-btn[data-page]").forEach(b=>b.classList.remove("active"));
 $(id).classList.add("active");
 document.querySelector(`.nav-btn[data-page="${id}"]`)?.classList.add("active");
 const titles={dashboard:"Dashboard",profile:"Business Profile",website:"Website Builder",analytics:"Simple Analytics",messages:"Customer Interaction",settings:"Settings"};
 $("pageTitle").textContent=titles[id];
}
function loadProfile(){
 const d=JSON.parse(localStorage.getItem("smallbizProfile")||"{}");
 const defaults={businessName:"Juan's Coffee Shop",category:"Coffee Shop",location:"Quezon City, Philippines",contact:"+63 912 345 6789",description:"A local coffee shop serving fresh coffee and snacks.",websiteTitle:"Juan's Coffee Shop",tagline:"Fresh coffee. Local flavor."};
 const x={...defaults,...d};
 for(const k in x){if($(k)) $(k).value=x[k]}
 updatePreview();
 $("avatar").textContent=(localStorage.getItem("smallbizOwner")||"BO").slice(0,2).toUpperCase();
}
function updatePreview(){
 $("previewTitle").textContent=$("websiteTitle").value||"Your Business";
 $("previewSmall").textContent=$("websiteTitle").value||"Your Business";
 $("previewTagline").textContent=$("tagline").value||"Your tagline";
}
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
 mode=btn.dataset.auth;document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 const reg=mode==="register";$("nameLabel").classList.toggle("hidden",!reg);$("ownerName").classList.toggle("hidden",!reg);
 $("authButton").textContent=reg?"Create Account":"Login";
});
$("authForm").onsubmit=e=>{
 e.preventDefault();
 const email=$("email").value.trim(), pass=$("password").value;
 if(mode==="register"){localStorage.setItem("smallbizAccount",JSON.stringify({email,pass,owner:$("ownerName").value||"Business Owner"}));localStorage.setItem("smallbizOwner",$("ownerName").value||"BO");toast("Account created!");}
 else {const a=JSON.parse(localStorage.getItem("smallbizAccount")||"null");if(a&&(a.email!==email||a.pass!==pass)){toast("Wrong email or password");return}localStorage.setItem("smallbizOwner",a?.owner||"Business Owner");}
 auth.classList.add("hidden");app.classList.remove("hidden");loadProfile();
};
document.querySelectorAll(".nav-btn[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showPage(b.dataset.go));
$("logoutBtn").onclick=()=>{app.classList.add("hidden");auth.classList.remove("hidden");toast("Logged out")};
$("saveProfile").onclick=()=>{
 const d={businessName:$("businessName").value,category:$("category").value,location:$("location").value,contact:$("contact").value,description:$("description").value,websiteTitle:$("websiteTitle").value,tagline:$("tagline").value};
 localStorage.setItem("smallbizProfile",JSON.stringify(d));toast("Business profile saved!");
};
$("images").onchange=e=>{const p=$("imagePreview");p.innerHTML="";[...e.target.files].forEach(f=>{const r=new FileReader();r.onload=()=>{const im=document.createElement("img");im.src=r.result;p.appendChild(im)};r.readAsDataURL(f)});toast("Images selected")};
document.querySelectorAll(".template").forEach(b=>b.onclick=()=>{document.querySelectorAll(".template").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");toast(b.dataset.template+" template selected")});
$("websiteTitle").oninput=updatePreview;$("tagline").oninput=updatePreview;
$("publishBtn").onclick=()=>{let d=JSON.parse(localStorage.getItem("smallbizProfile")||"{}");d.websiteTitle=$("websiteTitle").value;d.tagline=$("tagline").value;localStorage.setItem("smallbizProfile",JSON.stringify(d));toast("Website published successfully!")};
$("darkMode").onchange=e=>{document.body.classList.toggle("dark",e.target.checked);localStorage.setItem("smallbizDark",e.target.checked)};
document.querySelectorAll(".reply").forEach(b=>b.onclick=()=>toast("Reply feature opened (prototype)."));
if(localStorage.getItem("smallbizDark")==="true"){$("darkMode").checked=true;document.body.classList.add("dark")}
if(localStorage.getItem("smallbizAccount")){$("email").placeholder="Use your saved email";}
// Demo login also works without registration
