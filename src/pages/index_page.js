import { Component, ReactNode, createRef } from "react";

export class Index_Page extends Component {
  constructor() {
    super();

    /** @type {Category_List} */
    this.m_Category_List = null;
    this.m_C_Index=0;
    this.m_S_Index=0;
    this.m_Old_Game_Pad=null;
  }
  async componentDidMount() {
    document.addEventListener("keydown",(e)=>{this.On_Key_Down(e)})
    this.Load_Param();
    console.log(window.history.state);
    //if(this.m_Category_List!=null){ this.m_Category_List=new Object(); return;}

    this.m_Category_List = await ((await fetch("./assets/data/category_list.json")).json());
    this.m_Category_List.categories = new Array();
    for (let i = 0; i < this.m_Category_List.category_json_urls.length; i++) {
      /**@type {Category_Item} */
      let t_cate = await ((await fetch(this.m_Category_List.category_base_url + this.m_Category_List.category_json_urls[i].list_url)).json());
      for(let j=0;j<t_cate.species.length;j++)
      {
        t_cate.species[j].ref=createRef();
      }
      t_cate.ref=createRef();
      this.m_Category_List.categories.push(t_cate);
    }
    console.log(this.m_Category_List)
    this.forceUpdate();

    this.On_Game_Pad_Loop();
    
    try {
      window.setTimeout(
          async () => {

              
              this.Init_Once();
              
          }, 500
      )
  } catch (e) {
      console.error(e)
  }
  }

  Save_Param()
  {
    window.localStorage.setItem("C_INDEX",this.m_C_Index);
    window.localStorage.setItem("S_INDEX",this.m_S_Index);


  }

  Load_Param()
  {
    this.m_C_Index=parseInt( window.localStorage.getItem("C_INDEX"));
    this.m_S_Index=parseInt(window.localStorage.getItem("S_INDEX"));
    this.m_C_Index=this.m_C_Index==null?0:this.m_C_Index;
    this.m_S_Index=this.m_S_Index==null?0:this.m_S_Index;
    this.m_C_Index=this.m_C_Index!=this.m_C_Index?0:this.m_C_Index;
    this.m_S_Index=this.m_S_Index!=this.m_C_Index?0:this.m_S_Index;
    this.Update_Scroll();

  }
  Init_Once() {
  
    this.Update_Scroll();
  }
  On_Game_Pad_Loop()
  {
    
    window.setTimeout(()=>{this.On_Game_Pad_Loop()},50);
    let t_gplist=navigator.getGamepads();
    let t_gp=null;
    for(let i=0;i<t_gplist.length;i++)
    {
      if(t_gplist[i]!=null)
      {
        t_gp=t_gplist[i];
        break;
      }
    }
    if(t_gp==null)
    {
      return;
    }
    if(this.m_Old_Game_Pad==null)
    {
      this.m_Old_Game_Pad=t_gp;
      return;
    }

    if(this.m_Old_Game_Pad.buttons[12].pressed==false && t_gp.buttons[12].pressed==true)
    {
      this.Event_Move_U();
    }
    if(this.m_Old_Game_Pad.buttons[13].pressed==false && t_gp.buttons[13].pressed==true)
    {
     this.Event_Move_D();
    }

    if(this.m_Old_Game_Pad.buttons[14].pressed==false && t_gp.buttons[14].pressed==true)
    {
      this.Event_Move_L();
    }
    if(this.m_Old_Game_Pad.buttons[15].pressed==false && t_gp.buttons[15].pressed==true)
    {
      this.Event_Move_R();
    }
    if(this.m_Old_Game_Pad.buttons[0].pressed==false && t_gp.buttons[0].pressed==true)
    {
    this.Event_Move_Enter();
    }




    //console.log(t_gp.buttons);
    this.m_Old_Game_Pad=t_gp;

  }

  /**
   * 
   * @param {KeyboardEvent} e 
   */
  On_Key_Down(e)
  {
    console.log(e.key);
    if(e.key=="ArrowDown")
    {
      this.Event_Move_D();
    }
    if(e.key=="ArrowUp")
    {
      this.Event_Move_U();
    }
    if(e.key=="ArrowLeft")
    {
      this.Event_Move_L();
    }
    if(e.key=="ArrowRight")
    {
      this.Event_Move_R();
    }
    if(e.key=="Enter")
    {
      this.Event_Move_Enter();
    }
  }

  Event_Move_U()
  {
    this.m_C_Index--;
    if(this.m_C_Index<0){this.m_C_Index=0};
    if(this.m_C_Index>=this.m_Category_List.categories.length){this.m_C_Index=this.m_Category_List.categories.length-1};
    if(this.m_S_Index<0){this.m_S_Index=0};
    if(this.m_S_Index>=this.m_Category_List.categories[this.m_C_Index].species.length){this.m_S_Index=this.m_Category_List.categories[this.m_C_Index].species.length-1};
 
    this.forceUpdate();
    this.Update_Scroll();
  }
  Event_Move_D()
  {
    this.m_C_Index++;
    if(this.m_C_Index<0){this.m_C_Index=0};
    if(this.m_C_Index>=this.m_Category_List.categories.length){this.m_C_Index=this.m_Category_List.categories.length-1};
    if(this.m_S_Index<0){this.m_S_Index=0};
    if(this.m_S_Index>=this.m_Category_List.categories[this.m_C_Index].species.length){this.m_S_Index=this.m_Category_List.categories[this.m_C_Index].species.length-1};
 
    this.forceUpdate();
    this.Update_Scroll();
  }
  Event_Move_L()
  {
    this.m_S_Index--;
      if(this.m_S_Index<0){this.m_S_Index=0};
      if(this.m_S_Index>=this.m_Category_List.categories[this.m_C_Index].species.length){this.m_S_Index=this.m_Category_List.categories[this.m_C_Index].species.length-1};
      this.forceUpdate();
      this.Update_Scroll();
  }
  Event_Move_R()
  {
    this.m_S_Index++;
      if(this.m_S_Index<0){this.m_S_Index=0};
      if(this.m_S_Index>=this.m_Category_List.categories[this.m_C_Index].species.length){this.m_S_Index=this.m_Category_List.categories[this.m_C_Index].species.length-1};
      this.forceUpdate();
      this.Update_Scroll();
  }
  Event_Move_Enter()
  {
    this.Save_Param();
    let t_spec = this.m_Category_List.categories[this.m_C_Index].species[this.m_S_Index];
    window.history.pushState(
      {
        pre_url: this.m_Category_List.video_base_url + t_spec.video_pre,
        res_url: this.m_Category_List.video_base_url + t_spec.video_res,
        timing_start: t_spec.t_s,
        timing_end: t_spec.t_e,
      },
      "",
      "./#/training"
    );
    window.history.go(0);
  }

  Update_Scroll()
  {
    try{

      let t_ref= this.m_Category_List.categories[this.m_C_Index].species[this.m_S_Index].ref;
      let t_rect=t_ref.current.getBoundingClientRect();
      console.log(t_rect);
      window.scrollBy({top:t_rect.y-400,behavior:"smooth"});
    }catch(e)
    {

    }
  }

  render() {

    
    if (this.m_Category_List == null) {
      return (<div></div>)
    }
    this.Save_Param();
    let t_ele = new Array();
    for (let t_ci = 0; t_ci < this.m_Category_List.categories.length; t_ci++) {
      let t_buttons = new Array();
      for (let i = 0; i < this.m_Category_List.categories[t_ci].species.length; i++) {
        let t_spec = this.m_Category_List.categories[t_ci].species[i];

        t_buttons.push(
          <button
          ref={t_spec.ref}
          key={i}
            style={{borderWidth:(this.m_C_Index==t_ci&& this.m_S_Index==i)?"8px":"2px", margin: "6px 6px", height: "48px", borderRadius: "12px",borderColor:"gray", borderStyle:"solid" }}
            onClick={() => {
              this.m_C_Index=t_ci;
              this.m_S_Index=i;
              this.Save_Param();
              window.history.pushState(
                {
                  pre_url: this.m_Category_List.video_base_url + t_spec.video_pre,
                  res_url: this.m_Category_List.video_base_url + t_spec.video_res,
                  timing_start: t_spec.t_s,
                  timing_end: t_spec.t_e,
                },
                "",
                "./#/training"
              );
              window.history.go(0);
            }}
          >
            {t_spec.name}
          </button>


        );



      }
      t_ele.push(

        <div ref={this.m_Category_List.categories[t_ci].ref} key={t_ci} style={{ borderWidth:this.m_C_Index==t_ci?"8px":"2px",borderColor:"gold", borderStyle:"solid", margin: "24px", padding: "6px", position: "relative", display: "flex", flexWrap: "wrap", borderRadius: "12px",  borderStyle: "solid", borderColor: "gray", boxShadow: " 10px 5px 5px gray" }}>
          <div style={{ fontSize: "6px", padding: "2px 16px", height: "16px", display: "block", position: "absolute", top: "-16px", left: "12px", backgroundColor: "white", borderColor: "gray", borderWidth: "2px", borderRadius: "12px", borderStyle: "solid" }}>{this.m_Category_List.categories[t_ci].category_name}</div>
          <img style={{ margin: "6px", width: "48px", height: "48px", borderRadius: "12px" }} src={"./"+this.m_Category_List.categories[t_ci].img}></img>
          {t_buttons}

        </div>
      );

    }

    return (
      <div style={{backgroundColor:"rgb(240,240,240)"}}>
        <div style={{ margin: "0 auto " }}>
          <div style={{ width: "max-content", margin: "0 auto ", fontSize: "36px" }}>
            <img src="./assets/images/royal_guard_logo.png" width={"128px"}></img>
          </div>
          <div style={{ width: "max-content", margin: "0 auto ", fontSize: "36px" }}>

            盾反练习器
          </div>
        </div>
        <div >

          {t_ele}
        </div>

      </div>
    );
  }
}

class Category_List {
  constructor() {
    this.video_base_url = ""
    this.category_base_url = ""
    /** @type {Array<Category_Item>} */
    this.categories = new Array()
    /** @type {Array<Category_Json_URL_Item>} */
    this.category_json_urls = new Array()
  }
}
class Category_Json_URL_Item {
  constructor() {
    this.name = "";
    this.list_url = "";


  }
}
class Category_Item {
  constructor() {
    this.img = "";
    this.category_name = "";
    /** @type {Array<Species_Item>} */
    this.species = new Array();
    this.ref=createRef();
  }
}
class Species_Item {
  constructor() {
    this.name = "0"
    this.video_pre = ""
    this.video_res = ""
    this.t_s = 0
    this.t_e = 10
    this.desc = ""
    this.ref=createRef();
  }
}
