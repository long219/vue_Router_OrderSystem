//创建命名空间
namespace.ns("vue_BootstrapOrderSystem.js.adminMenu");

vue_BootstrapOrderSystem.js.adminMenu = {
	init:function(){
		var vm = new Vue({
			el:"#adM",
			data:{
				//存储所以菜品信息
				menuList:[],
				//存储后台传来的消息
				msg:"",
				menuName:"", //存储菜名
				sta:"", //状态
				istop:"",//置顶（Y / N）
				//存储数据下标
				indexUser:"",
				menuArray:{
					name:"",
					price:"",
					discount_price:"",
					isTop:"",
					state:"",
					stateName:"",
					id:""
				},
				rows:2, //展示的页数
				page: 1,//当前页码
				total:[], //总页数
				allPage:"" //记录总页数
			},
			
			methods:{
				
				//查询
				queryMenuAll(page){
					this.page = page
					//this.rows = rows
					//发送远程请求
					 axios.get('menuViewServlet',{
					 	params:{
							page:this.page,
							rows:this.rows
						},
						responseType:"json" 
					}) .then(responses=>{
						this.menuList = responses.data.rows;
						//每次调用该方法时清空
						this.total=[];
					
						//计算总页数
						var size = Math.ceil(responses.data.total/this.rows)
						this.allPage = size
						//debugger;
						for (var i = 1; i <= size; i++) {
							this.total.push(i)
						}
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				//删除数据
				deleteMenu(){
					let index =this.indexUser;
					//获取菜品Id
					var menuId =this.menuList[index].id;
					//将状态改为删除
					axios.get('menuViewServlet',{
					 	params:{
					 		menuId:menuId,
							mothed:"menuDelete"
					 	},
						responseType:"json" ,
						
					}) .then(responses=>{
						vm.queryMenuAll();
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				updataInfo(indexs){
					//将要修改的数据映射到页面上		
					this.menuArray.name = this.menuList[indexs].name;
					this.menuArray.price = this.menuList[indexs].price;
					this.menuArray.discount_price = this.menuList[indexs].discount_price;
					this.menuArray.isTop = this.menuList[indexs].isTop;
					this.menuArray.state = this.menuList[indexs].state;
					this.menuArray.stateName = this.menuList[indexs].stateName;
					this.menuArray.id = this.menuList[indexs].id
					
					console.log(this.menuArray)
				},
				//修改
				updata(){
					axios.get('menuViewServlet',{
					 	params:{
							mothed:"menuUpdate",
							menuLis:this.menuArray
					 	},
						responseType:"json" ,
					}) .then(responses=>{
						vm.queryMenuAll();
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				//根据菜品名查询
				getMenuNameQuery(){
					//console.log( this.menuName +" "+this.istop +" "+ this.sta)
					axios.get('menuViewServlet',{
					 	params:{
							page:this.page,
							rows:this.rows,
							name:this.menuName,
							isTop:this.istop,
							menuState:this.sta
					 	},
						responseType:"json" ,
					}) .then(responses=>{
						this.menuList = responses.data.rows;
					}) .catch(error=>{
						console.log("你很优秀！")
					})
					
				},
				
				 btnClick: function (data) {
				    if (data < 1) return;
				    if (data != this.page) {
				        this.page = data
				    }
					vm.queryMenuAll(this.page)
				},
				//下一页
				nextPage: function (data) {
				    if (this.page >= this.allPage) return;
				    this.btnClick(this.page + 1);
				},
				//上一页
				prvePage: function (data) {
				    if (this.page <= 1) return;
				    this.btnClick(this.page - 1);
				},
				setButtonClass: function (isNextButton) {
				    if (isNextButton) {
				        return this.page >= this.allPage ? "disabled" : ""
				    }
				    else {
				        return this.page <= 1 ? "disabled" : ""
				    }
				}
			}
		})
		/* ,vm.$data.rows */
		vm.queryMenuAll(vm.$data.page);
	}
}
//数据加载完成时调用
$(function(){
	vue_BootstrapOrderSystem.js.adminMenu.init();
	
})