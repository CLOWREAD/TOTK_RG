import React, { Component, createRef } from "react";
import Button from '@mui/material/Button';
import { Box, Chip, Container, InputLabel, Slider, Stack, Switch } from "@mui/material";


export class Training_Page extends Component {

    constructor(props) {
        super();
        this.props = props;
        this.m_Init_Flag = false;
        let t_h_state = window.history.state;
        this.m_Pre_URL = t_h_state.pre_url;
        this.m_Res_URL = t_h_state.res_url;
        this.m_Timing_S = t_h_state.timing_start;
        this.m_Timing_E = t_h_state.timing_end;

        this.m_Pre_Video_Blob = null;
        this.m_Res_Video_Blob = null;
        this.m_Pre_Video_Blob_URL = null;
        this.m_Res_Video_Blob_URL = null;

        /** @type {React.RefObject<HTMLVideoElement>} */
        this.m_Video_Pre = createRef();

        /** @type {React.RefObject<HTMLVideoElement>} */
        this.m_Video_Res = createRef();

        /** @type {React.RefObject<HTMLDivElement>} */
        this.m_Cursor = createRef();
        /** @type {React.RefObject<SVGCircleElement>} */
        this.m_Circle_Progress = createRef();
        /** @type {React.RefObject<SVGElement>} */
        this.m_Indicator = createRef();
        this.m_RG_Flag = false;
        this.m_RG_Success_Flag = false;

        this.m_Show_Indicator_Flag = true;
        this.m_Indicator_Speed = 1;
        this.m_Old_Game_Pad = null;
    }
    async componentDidMount() {
        document.addEventListener("keydown",(e)=>{this.On_Key_Down(e)})
        if (this.m_Pre_Video_Blob_URL == null || this.m_Res_Video_Blob_URL == null) {

            this.m_Pre_Video_Blob = await ((await fetch(this.m_Pre_URL)).blob());
            this.m_Res_Video_Blob = await ((await fetch(this.m_Res_URL)).blob());
            this.m_Pre_Video_Blob_URL = URL.createObjectURL(this.m_Pre_Video_Blob);
            this.m_Res_Video_Blob_URL = URL.createObjectURL(this.m_Res_Video_Blob);
            this.m_Video_Pre.current.style.visibility = "visible"
            this.m_Video_Res.current.style.visibility = "collapse"
            this.forceUpdate();
            window.addEventListener("resize", () => { this.forceUpdate() })
            this.Get_Show_Indicator();

        }
        try {
            window.setTimeout(
                async () => {

                    this.On_Timer();
                    this.Init_Once();
                    await this.m_Video_Pre.current.play();
                }, 500
            )
        } catch (e) {
            console.error(e)
        }
    }
      /**
   * 
   * @param {KeyboardEvent} e 
   */
  On_Key_Down(e)
  {
    if(e.key=="Enter")
    {
        this.On_Pointer_Down();
    }
    if(e.key=="Escape")
    {
        window.history.pushState(
            {

            },
            "",
            "./#/"
        );
        window.history.go(0);
    }

  }
    Set_Show_Indicator(value) {
        console.log(value);
        this.m_Show_Indicator_Flag = value;
        window.localStorage.setItem("SHOW_INDICATOR", this.m_Show_Indicator_Flag);
        if (this.m_Show_Indicator_Flag) {
            this.m_Indicator.current.style.visibility = "visible";
        } else {
            this.m_Indicator.current.style.visibility = "hidden";
        }
        this.forceUpdate();
    }
    Get_Show_Indicator() {
        var t_value = window.localStorage.getItem("SHOW_INDICATOR");
        t_value = t_value == "false" ? false : true;
        console.log(t_value)
        this.Set_Show_Indicator(t_value);
    }

    Set_Indicator_Speed(value) {
        console.log(value);
        this.m_Indicator_Speed = value;
        window.localStorage.setItem("INDICATOR_SPEED", this.m_Indicator_Speed);

        this.m_Video_Pre.current.playbackRate = 1 / value;
        this.forceUpdate();
    }
    Get_Indicator_Speed() {
        var t_value = window.localStorage.getItem("INDICATOR_SPEED");
        t_value = t_value == null ? 1 : parseFloat(t_value);

        console.log(t_value)
        this.Set_Indicator_Speed(t_value);
    }

    Init_Once() {
        this.On_Game_Pad_Loop();
        
        this.Get_Indicator_Speed();
        let t_pre_video_dur = 10;
        if (this.m_Video_Pre.current != null) {
            t_pre_video_dur = this.m_Video_Pre.current.duration;
        }
        if (t_pre_video_dur < this.m_Timing_E) {
            this.m_Timing_E = t_pre_video_dur - 0.01;
        }

        this.m_Circle_Progress.current.style.strokeDasharray = [Math.PI * 150 * 2 * (this.m_Timing_E - this.m_Timing_S) / t_pre_video_dur, Math.PI * 150 * 4];
        this.m_Circle_Progress.current.style.strokeDashoffset = -Math.PI * 150 * 2 * (t_pre_video_dur - this.m_Timing_E) / t_pre_video_dur;

    }

    On_Timer() {
        if (this.m_Cursor != null && this.m_Cursor.current != null && this.m_RG_Flag == false) {

            this.m_Cursor.current.style.top = "360px"
            //console.log(this.m_Video_Pre.current.currentTime);
            let t_ratio = this.m_Video_Pre.current.currentTime / this.m_Video_Pre.current.duration
            this.m_Cursor.current.style.rotate = 360 * t_ratio + (-90) + "deg";


            //console.log(this.m_Circle_Progress.current.strokeDashoffset,this.m_Circle_Progress.current.strokeDasharray)
        }
        window.setTimeout(() => { this.On_Timer() }, 10);
    }

    On_Pre_V_End() {
        if (this.m_RG_Success_Flag) {

            this.m_Video_Pre.current.style.visibility = "collapse"
            this.m_Video_Res.current.style.visibility = "visible"
            this.m_Video_Res.current.play();
        } else {
            this.m_Video_Pre.current.style.visibility = "visible"
            this.m_Video_Res.current.style.visibility = "collapse"
            this.m_Video_Pre.current.play();
            this.m_RG_Flag = false;
            this.m_RG_Success_Flag = false;
        }
    }
    On_Res_V_End() {
        this.m_Video_Pre.current.style.visibility = "visible"
        this.m_Video_Res.current.style.visibility = "collapse"
        this.m_Video_Pre.current.play();
        this.m_RG_Flag = false;
        this.m_RG_Success_Flag = false;
    }

    Full_Screen_Enabled() {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement
        );
    }
    Full_Screen_Cancel() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    Full_Screen() {
        let element = document.body
        if (document.mozFullScreenEnabled) {
            return Promise.reject(new Error("全屏模式被禁用"));
        }
        let result = null;
        if (element.requestFullscreen) {
            result = element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            result = element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            result = element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            result = element.webkitRequestFullScreen();
        }
        return result || Promise.reject(new Error("不支持全屏"));
    }

    On_Pointer_Down() {
        if (this.m_Video_Pre.current.pl && this.m_Video_Res.current.paused) {
            this.m_Video_Pre.current.play();
        }
        if (this.m_RG_Flag == false) {
            let t_time = this.m_Video_Pre.current.currentTime;
            console.log(t_time)
            if (t_time >= this.m_Timing_S && t_time <= this.m_Timing_E) {
                this.m_RG_Success_Flag = true;
            }


        }
        this.m_RG_Flag = true;


    }

    On_Game_Pad_Loop() {

        window.setTimeout(() => { this.On_Game_Pad_Loop() }, 50);
        let t_gplist = navigator.getGamepads();
        let t_gp = null;
        for (let i = 0; i < t_gplist.length; i++) {
            if (t_gplist[i] != null) {
                t_gp = t_gplist[i];
                break;
            }
        }
        if (t_gp == null) {
            return;
        }
        if (this.m_Old_Game_Pad == null) {
            this.m_Old_Game_Pad = t_gp;
            return;
        }

        if (this.m_Old_Game_Pad.buttons[0].pressed == false && t_gp.buttons[0].pressed == true) {

            this.On_Pointer_Down();

        }

        if (this.m_Old_Game_Pad.buttons[1].pressed == false && t_gp.buttons[1].pressed == true) {


            window.history.pushState(
                {

                },
                "",
                "./#/"
            );
            window.history.go(0);

        }
        //console.log(t_gp.buttons);
        this.m_Old_Game_Pad = t_gp;

    }

    render() {


        let t_w = window.innerWidth;
        let t_h = window.innerHeight;
        let t_rotate_enable = t_h > t_w;

        let t_scale_factor = 1;
        if (t_rotate_enable) {
            t_scale_factor = Math.min(t_h / 1280, t_w / 720);
        } else {
            t_scale_factor = Math.min(t_w / 1280, t_h / 720);
        }
        let t_scale_style = t_scale_factor.toString();


        document.body.style.height = t_h + "px";
        document.body.style.backgroundColor = "black";

        return (
            <div style={{ backgroundColor: "black", width: "1280px", height: "720px", scale: t_scale_style, transformOrigin: "50% 50%", position: "absolute", rotate: t_rotate_enable ? "90deg" : "0deg", left: t_w / 2 + "px", top: t_h / 2 + "px", translate: "-50% -50%" }}>


                <div style={{ zIndex: 9, height: "36px", position: "absolute", left: "20px", top: "0px" }}>
                    <Stack direction={"row"} spacing={2}>
                        <Button variant="contained" onClick={() => {

                            window.history.pushState(
                                {

                                },
                                "",
                                "./#/"
                            );
                            window.history.go(0);
                        }}> 返回</Button>
                        <Button variant="contained" onClick={() => { if (this.Full_Screen_Enabled()) { this.Full_Screen_Cancel() } else { this.Full_Screen() } }}> 全屏切换</Button>
                        <Box color="primary" sx={{ padding: "12px 12px", width: "90px", height: "48px", backgroundColor: "primary.main", borderRadius: "4px", color: "#FFFFFF" }}  >
                            显示指示器:
                            <Switch color="warning" checked={this.m_Show_Indicator_Flag} onChange={(e) => { this.Set_Show_Indicator(e.target.checked); }} ></Switch>
                        </Box>
                        <Box color="primary" sx={{ padding: "12px 12px", width: "120px", height: "48px", backgroundColor: "primary.main", borderRadius: "4px", color: "#FFFFFF" }}  >
                            慢速:
                            <Slider value={this.m_Indicator_Speed} min={1} step={0.01} max={2.5} color="warning" onChange={(e) => { this.Set_Indicator_Speed(e.target.value) }} ></Slider>
                        </Box>
                    </Stack>
                </div>

                <div style={{ width: "1280px", height: "720px", position: "absolute", top: "0px", left: "0px" }}>

                    <video onEnded={() => { this.On_Pre_V_End(); }} style={{ position: "absolute", top: "0px" }} ref={this.m_Video_Pre} src={this.m_Pre_Video_Blob_URL}></video>
                    <video onEnded={() => { this.On_Res_V_End(); }} style={{ position: "absolute", top: "0px" }} ref={this.m_Video_Res} src={this.m_Res_Video_Blob_URL}></video>
                </div>
                <div style={{ width: "1280px", height: "720px", position: "absolute", top: "0px" }} onPointerDown={() => { this.On_Pointer_Down() }}></div>

                <div ref={this.m_Indicator} style={{ pointerEvents: "none", zIndex: 10, position: "absolute", left: "0px", top: "0px", width: "1280px", height: "720px" }}>

                    <div ref={this.m_Cursor} style={{ zIndex: 12, left: "640px", top: "360px", transformOrigin: "50% 50%", position: "absolute", width: "12px", height: "12px", translate: "-50% -50%", backgroundColor: "red" }}>
                        <div style={{ transformOrigin: "50% 50%", position: "absolute", left: "150px", top: "6px", width: "48px", height: "6px", translate: "-50% -50%", backgroundColor: "red" }}>

                        </div>
                    </div>
                    <svg style={{ pointerEvents: "none", zIndex: 10, position: "absolute", left: "0px", top: "0px", width: "1280px", height: "720px" }} >
                        <circle cx="640" cy="360" r="150" fill="none" strokeWidth="16" stroke="#7C83FD70"></circle>
                        <circle ref={this.m_Circle_Progress} transform="translate(640 360) scale(-1 1) rotate(-90)" cx="0" cy="0" r="150" fill="none" strokeWidth="24" stroke="#FF8000A0"
                        ></circle>
                    </svg>
                </div>
            </div>
        )
    }



}