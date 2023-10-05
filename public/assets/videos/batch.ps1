 foreach ($a in ls *.mp4 ) 
 { 
 
 $filename_no_ext= [System.IO.Path]::GetFileNameWithoutExtension("$a")

 echo "$filename_no_ext"

 ffmpeg -y -i $filename_no_ext".mp4" $filename_no_ext".webm"
 }
