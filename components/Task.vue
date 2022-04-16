<!-- Please remove this file from your project -->
<template>
  <div >
    <div class="form">  
      <h1 class="red text-center pb-5">Super2Do</h1>

      <b-list-group class="mt-3">
        <b-list-group-item>
          <div class="input-group">
            <b-dropdown id="dropdown-1" class="dark" variant="link" toggle-class="text-decoration-none" no-caret no-flip>
              <template #button-content>
                <span class="black">
                  <i class="fa fa-chevron-down"></i>
                </span>
              </template>
              <b-dropdown-item @click="checkedAll()">
                <b-form-checkbox size="lg"  v-model="selectAll" >Select All </b-form-checkbox>
              </b-dropdown-item>
            </b-dropdown>
            <input type="text" v-model="newTask" v-on:keyup.enter="add()" placeholder="What need to be done?" class="form-control no-border mx-2" >
          </div>
        </b-list-group-item>
        <div v-for="item in listTask">
          <b-list-group-item v-if="item.status==1" @click="update(item.id,0)">
            <div class="input-group complite">
              <span >
                <b-form-checkbox size="lg" :value="item.id" :checked="item.id" ><span class="scribble  text">{{item.title}}</span></b-form-checkbox>
              </span>
            </div>
          </b-list-group-item>
          <b-list-group-item v-if="item.status==0" @click="update(item.id,1)">
            <div class="input-group active">
              <span>
                <b-form-checkbox size="lg" :value="item.id"><span class="text">{{item.title}}</span></b-form-checkbox>
              </span>
              
            </div>
          </b-list-group-item>
        </div>
        <b-list-group-item>
          <div class="row f2">
            <div class="col-3">
              {{listTask.length}} item left
            </div>
            <div class="col-5 text-center">
              <span class="mx-1 item" @click="status='all';get()">All</span>
              <span class="mx-1 item" @click="status='active';get()" >Active</span>
              <span class="mx-1 item" @click="status='complite';get()">Complete</span>
            </div>
            <div class="col-4 text-right">
              <span class=" item" @click="clear()">Clear Completed</span>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Task',
  data:() => ({ 
    listTask:[],
    newTask:"",
    status:"all",
    options:[],
    active:[],
    selectAll:false,
  }),
  created(){
    this.get();
  },
  methods:{
    async checkedAll(){
      if(!this.selectAll){
        this.selectAll=!this.selectAll;
        console.log(JSON.stringify(this.active))
        const res=await this.$axios.put('/api/completedTask',{"data":this.active});
        if(res.data.message==""){
          this.get();
        }else{
          console.log(res.data.message);
        }
      }else{
        this.selectAll=!this.selectAll
      }
    },
    async get(){
      const res=await this.$axios.get('/api/getTask?status='+this.status);
      this.listTask=res.data.data;
      let arr=[];
      let act=[];
      this.listTask.forEach(function(val){
        arr.push({"text":val.title,"value":val.status});
        if(val.status==0){
          act.push(val.id);
        }
      })
      this.active=act;
      this.options=arr;
      console.log(this.options)
    },
    async add(){
      const res=await this.$axios.post('/api/addTask',{'title':this.newTask,'status':0});
      if(res.data.message==""){
        this.newTask="";
        this.get();
      }else{
        console.log(res.data.message);
      }
    },
    async update(id,status){
      const res=await this.$axios.put('/api/updateTask?id='+id,{'status':status});
      if(res.data.message==""){
        this.get();
      }else{
        console.log(res.data.message);
      }
    },
    async clear(){
      const res=await this.$axios.delete('/api/clearComplite');
      if(res.data.message==""){
        this.get();
      }else{
        console.log(res.data.message);
      }
    },
  }
}
</script>
