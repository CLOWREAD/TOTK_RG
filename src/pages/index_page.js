import { Component, ReactNode } from "react";

export class Index_Page extends Component {
  constructor() {
    super();

    /** @type {Category_List} */
    this.m_Category_List = null;
  }
  async componentDidMount() {
    console.log(window.history.state);
    //if(this.m_Category_List!=null){ this.m_Category_List=new Object(); return;}

    this.m_Category_List = await ((await fetch("./assets/data/category_list.json")).json());
    this.m_Category_List.categories = new Array();
    for (let i = 0; i < this.m_Category_List.category_json_urls.length; i++) {
      let t_cate = await ((await fetch(this.m_Category_List.category_base_url + this.m_Category_List.category_json_urls[i].list_url)).json());
      this.m_Category_List.categories.push(t_cate);
    }
    console.log(this.m_Category_List)
    this.forceUpdate();




  }
  render() {

    if (this.m_Category_List == null) {
      return (<div></div>)
    }
    let t_ele = new Array();
    for (let t_ci = 0; t_ci < this.m_Category_List.categories.length; t_ci++) {
      let t_buttons = new Array();
      for (let i = 0; i < this.m_Category_List.categories[t_ci].species.length; i++) {
        let t_spec = this.m_Category_List.categories[t_ci].species[i];

        t_buttons.push(
          <button
            style={{ margin: "6px 6px", height: "48px", borderRadius: "12px" }}
            onClick={() => {
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

        <div style={{ margin: "24px", padding: "6px", position: "relative", display: "flex", flexWrap: "wrap", borderRadius: "12px", borderWidth: "2px", borderStyle: "solid", borderColor: "gray", boxShadow: " 10px 5px 5px gray" }}>
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

            盾反模拟器
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
  }
}
