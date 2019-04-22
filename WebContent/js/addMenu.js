//创建命名空间
namespace.ns("vue_BootstrapOrderSystem.js.addMenu");

vue_BootstrapOrderSystem.js.addMenu = {
	init:function(){
		var vm = new Vue({
			el:"#addM",
			data:{
				//要存储菜品信息	
				menuArr:{
					name:"",
					price:"",
					discount_price:"",
					isTop:"",
					state:"",
					stateName:"",
				}
			},
			methods:{	
				add(){
					var r=this.menuArr
					//发送远程请求
					axios.get('menuViewServlet',{
					 	params:{
							mothed:"menuAdd",
							menuLis:this.menuArr	,
						},
						responseType:"text" 
					}) .then(responses=>{
						if (responses.data=="添加成功!") {
							this.menuArr={};
							toastr.success(responses.data);
						}
					}) .catch(error=>{
						console.log("你很优秀！")
					})
				},
				closed(){
					this.flag=true
				}
			}
		})
	
	}
}
//数据加载完成时调用
$(function(){
	vue_BootstrapOrderSystem.js.addMenu.init();
	$('#myModalUAdd').modal('show')
})