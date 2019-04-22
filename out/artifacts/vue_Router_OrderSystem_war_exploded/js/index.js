//创建命名空间
namespace.ns("vue_Router_OrderSystem.js.index");

vue_Router_OrderSystem.js.index = {
	
	init:function(){
		
		//登录
		const Login = {
			template:"#tpLogin",
			data(){
				return {
					//存储登录时用户信息
					user:{
						phone:"",
						password:""
					},
					flag:true,
					userId:"" //用户Id
				}
			},
			methods:{
				//用户登录
				login(){
					this.getUserId();
					
					//发送远程请求
					 axios.get('userRegister',{
						params:{
							list:this.user,
							method:"enterd"
						},
						responseType:"text"
					}) .then(responses=>{
						if (responses.data=="普通会员界面") {
							//成功后提示
							toastr.success(responses.data);
							
						}
						if(responses.data=="管理员界面"){
							//成功后提示
							toastr.success(responses.data);
							
							router.push({path:"/adminShow",query:{
								userId:this.userId
							}});
							
						}else{
							/* 登录失败提示 */
							toastr.success(responses.data);
						}
						
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				//获取用户Id
				getUserId(){
					if (this.user.phone != null) {
						//发送远程请求
						 axios.get('userRegister',{
							params:{		
								usm:this.user.phone
							},
							responseType:"text"
						}) .then(responses=>{
							this.userId=responses.data
						}) .catch(error=>{
							console.log("你很优秀！")
						})
					}else{
						return
					}
				},
				
				//注销
				register(){
					router.push({path:"/register"});
				}
			}
		}
		
		//注册
		const Register = {
			template :"#tpRegister",
			data(){
				return {
					user:{
						phone:"",
						password:"",
						username:"",
						address:"",
						money:""
					}
				}
			},
			methods:{
				//用户注册
				myRegister(){
					//发送远程请求
					 axios.get('userRegister',{
						params:{
							list:this.user,
							method:"userAdd"
						},
						responseType:"text"
					}) .then(responses=>{
							//消息框
							toastr.success(responses.data);
							this.user = {};
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				//放回上一层
				retureUpperstory(){
					router.push({path:"/login"});
				}
			}
		}
		
		//管理员主页面
		const AdminShow = {
			template:"#adminS",
			data(){
				return {
					//存储用户信息
					userList:{}
				}
			},
			methods:{
				//查询所有菜品
				queryMenu(){
						router.push({path:"/adminShow/adminMenu"});		
				},
				//增加菜品
				addMenu(){
					router.push({path:"/adminShow/adminAdd"});
				},
				//查询所有订单
				orderQuery(){
					//$("#menuQueryAll").load("orderAdmin.html");	
				},
				//获取用户Id
				getUserIDQueryAll(){
					
					//获取用户Id
					var userIds =this.$route.query.userId
					
					//发送远程请求
					 axios.get('userRegister',{
					 	params:{
							method:"queryUserID",
							userID:userIds
						},
						responseType:"json" 
					}) .then(responses=>{
						//debugger;	将后台传来的信息赋给 userList				
						this.userList= responses.data
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				}
			},
			mounted(){
				this.getUserIDQueryAll();
			}
		}
		
		//首页
		const Home={
			template:"#homed"
		}
		
		//管理的查询菜品信息
		const AdminMenu = {
			template:"#adminM",
			data(){
				return {
					//存储所以菜品信息
					menuList:[],
					msg:"",  //存储后台传来的消息
					menuName:"", //存储菜名
					sta:"", //状态
					istop:"",//置顶（Y / N）
					indexUser:"", //存储数据下标
					rows:10, //展示的页数
					page: 1,//当前页码
					total:[], //总页数
					allPage:"" //记录总页数
				}
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
						toastr.success(responses.data);
						//this.queryMenuAll();
						router.push({path:"/adminShow/adminMenu"})
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				
				//菜品修改
				updataInfo(indexs){
					let  menuArray = this.menuList[indexs];
					// 将 menuArray 专递下去
					router.push({path:"/adminShow/adminUpate",query:{
							menuArray:menuArray
						}})
				},
				//根据菜品名查询
				getMenuNameQuery(){
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
			},
			mounted(){
				this.queryMenuAll(this.page);
			}
		}
		
		//管理员增加菜品
		const AdminAdd={
			template:"#adminA",
			data(){
				return {
					//要存储菜品信息	
					menuArr:{
						name:"",
						price:"",
						discount_price:"",
						isTop:"",
						state:"",
						stateName:"",
					}
				}
			},
			
			methods:{	
				add(){
					var r=this.menuArr
					//发送远程请求
					axios.get('menuViewServlet',{
					 	params:{
							mothed:"menuAdd",
							menuLis:this.menuArr
						},
						responseType:"text" 
					}) .then(responses=>{
						if (responses.data=="添加成功!") {
							this.menuArr={};
							toastr.success(responses.data);
							//添加成功后跳转到主页面
							router.push({path:"/adminShow/adminMenu"});	
						}
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				closed(){
					router.push({path:"/adminShow/adminMenu"});	
				},
				
			}
		}
		
		//管理员修改菜品
		const AdminUpate={
			template:"#adminMenuUpated",
			data(){
				return {
					menuArray:{
						name:"",
						price:"",
						discount_price:"",
						isTop:"",
						state:"",
						stateName:"",
						id:""
					}
				}
			},
			
			methods:{
				//修改
				updata(){
					axios.get('menuViewServlet',{
					 	params:{
							mothed:"menuUpdate",
							menuLis:this.menuArray
					 	},
						responseType:"json" ,
					}) .then(responses=>{
						
						toastr.success(responses.data);
						
						router.push({path:"/adminShow/adminMenu"})
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				
				cancel(){
					router.push({path:"/adminShow/adminMenu"})
				}
			},
			//当DOM节点挂载到实例上去之后调用该钩子
			mounted(){
				this.menuArray = this.$route.query.menuArray
			}
		}
		//配置路由和组件的关系
		const routes =[
			{path:"/login",component:Login},
			{path:"/register",component:Register},
			{path:"/adminShow",component:AdminShow,
				children:[
					{
						path:"adminMenu",
						component:AdminMenu //菜品信息
					},
					{
						path:"home",
						component:Home
					},
					{
						path:"adminAdd",
						component:AdminAdd //菜品增加
					},
					{
						path:"adminUpate",
						component:AdminUpate //菜品修改
					},
					{path:"*",redirect:"home"}
					]
			},
			
			{path:"*",redirect:"/login"}
		]
		
		//创建路由实例 ，可以设置属性
		const router = new VueRouter({
			routes  // (缩写) router:router
 		})
		
		var vm = new Vue({
			el:"#login-box",
			router
			
		})
	}
}
//数据加载完成时调用
window.onload = function(){
	vue_Router_OrderSystem.js.index.init();
}