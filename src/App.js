import axios from 'axios';
import './App.css';
import React,{useState,useEffect} from 'react'
import ReactMarkdown from 'react-markdown';

const time = [{
  'ONE':1,'TWO':2,'TREE':3,'FOUR':4,'SIX':6,'SEVEN':7,'EIGHT':8,'NINE':9,'TEM':10,'ELEVEN':11,'TWELVE':12,'THIRTEEN':13,'FOURTEEN':14,'FIFTEEN':15,'SIXTEEN':16,'SEVENTEEN':17,'EIGHTENN':18,'NINETEEN':19,'TWENTY':20,'TWENTY_ONE':21,'TWENTY_TWO':22,'TWENTY_THREE':23,'TWENTY_FOUR':24
}
]
const time_ = [
  
'ONE','TWO','TREE','FOUR','SIX','SEVEN','EIGHT','NINE','TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN','TWENTY','TWENTY_ONE','TWENTY_TWO','TWENTY_THREE','TWENTY_FOUR'
]
const App = () => {


  const [date, setDate] = useState(new Date());
  const [search,setSearch] = useState()
  const [data, setData] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graph,setGraph] = useState(false)

  function tick() {
    setDate(new Date());
   }
  const onKeyPress = (e)=>{
    if(e.key == 'Enter'){
      getApi(search);
    }
  }
  const getHistory = async (Station,Line) =>{
    //this api, with the station name and line, shows the amount of traffic each station receives
    try {

      setError(null);
      setData(null);

      setLoading(true);
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/55577058466d696e3932774c4f6e55/json/CardSubwayTime/1/1000/202101/${encodeURI(Line)}/${encodeURI(Station)}`
      );
      try{
        const nowData = response.data.CardSubwayTime.row[0];
        setResult(nowData[`${time_[date.getHours()-2]}_RIDE_NUM`]+nowData[`${time_[date.getHours()-2]}_ALIGHT_NUM`]);
         
      }
      catch(e){
        setError('There is No Data in Seoul Open API');
        setResult(null)
      }

    } catch (e) {
      console.log(e);
    }
  }
  const getApi = async (search) =>{
    //this api shows what line a station is on
    try {

      setError(null);
      setData(null);

      setLoading(true);
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/55577058466d696e3932774c4f6e55/json/SearchInfoBySubwayNameService/1/10/${encodeURI(search)}`
      );
      try{
        setData(response.data.SearchInfoBySubwayNameService.row);
       
      }
      catch(e){
        setError('There is No Data in Seoul Open API');
        setResult(null)
      }
    } catch (e) {
      console.log(e);
    }
  }
  function GrpahContents(){
    return(
      <section>
        <div>
          <h3>Stations with the most passengers boarding per every hour</h3>
          <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
import matplotlib.pyplot as plt
import matplotlib as mat
plt.rc('font',family='AppleGothic')

f = open('subwaytime.csv','r',encoding='utf-8')
data = csv.reader(f)
next(data)
next(data)
mx = [0] * 24
mx_station = [''] * 24
for row in data:
    row[3:] = map(int,row[3:])
    for j in range(24):
        a = row[j*2+3]
        if a > mx[j]:
            mx[j] = a
            mx_station[j] = row[2] + '(' + str((j+4)%24) + ')'

plt.title('Stations with the most people boarding trains')
plt.bar(range(24),mx)
plt.xticks(range(24),mx_station,rotation=90)
plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/ride.jpg'/>
          </div>
          
        </div>
        <div>
        <h3>The station with the most drop-offs by time zone.</h3>
        <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
import matplotlib.pyplot as plt
import matplotlib as mat
plt.rc('font',family='AppleGothic')

f = open('subwaytime.csv','r',encoding='utf-8')
data = csv.reader(f)
next(data)
next(data)
mx = [0] * 24
mx_station = [''] * 24
for row in data:
    row[3:] = map(int,row[3:])
    for j in range(24):
        a = row[j*2+4]
        if a > mx[j]:
            mx[j] = a
            mx_station[j] = row[2] + '(' + str((j+4)%24) + ')'

plt.title('Stations with the most people getting off')
plt.bar(range(24),mx,color='r')
plt.xticks(range(24),mx_station,rotation=90)
plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/dropoff.jpg'/>
          </div>
        </div>
        <div>
          <h3>Trend of people getting in and out by subway time zone</h3>
          <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
import matplotlib.pyplot as plt
import matplotlib as mat
plt.rc('font',family='AppleGothic')

f = open('subwaytime.csv','r',encoding='utf-8')
data = csv.reader(f)
next(data)
next(data)

s_in = [0] * 24
s_out = [0] * 24

for row in data:
    row[3:] = map(int,row[3:])
    for i in range(24):
        s_in[i] += row[i*2+3]
        s_out[i] += row[i*2+4]

plt.figure(dpi=300)
plt.title('      Trend of people getting in and out by subway time zone')
plt.plot(s_in,label = 'RIDE')
plt.plot(s_out,label = 'GET OFF')

plt.legend()
plt.xticks(range(24),range(4,28))
plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/last.jpg'/>
          </div>
          <div>
          <h3>Mean amount of traffic for each station</h3>
          <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
import numpy as np
import csv
f = open('subwaytime.csv','r',encoding='utf-8')
data = csv.reader(f)
next(data)
next(data)

avg = []
avg_station = []
for row in data:
    row[3:] = map(int,row[3:])
    avg.append(np.mean(row[4:51]))
    avg_station.append(row[2] + '(' + row[1] + ')')
    
plt.bar(avg_station,avg)
plt.xticks(range(len(avg)),avg_station,rotation=90)
plt.show()
               `
            }
          />
              

          </div>
          </div>
        </div>
      </section>
    )
  }

  useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
    return function cleanup() {
        clearInterval(timerID);
      };
   });
   


  return (
    <div className="App">
      <header className="App-header">
        <h1>How Crowded Is It?</h1>
        <p>by Jinwoo Moon, 2021/02</p>
        <h2>{date.toLocaleTimeString()}</h2>
       <input type="search" onKeyPress={onKeyPress} onChange={(e)=>{setSearch(e.target.value);setResult(null)}} placeholder="Enter a Station Name"/>
       {data&&
       <>
        <h3>Choose Line</h3>
        {
        data.map((index,key)=>(
          <a href="#" onClick={()=>getHistory(index['STATION_NM'],(index['LINE_NUM'].charAt(0)==='0'?index['LINE_NUM'].slice(1):index['LINE_NUM']))}><li>{(index['LINE_NUM'].charAt(0)==='0'?index['LINE_NUM'].slice(1):index['LINE_NUM'])}</li></a>
        ))
        }</>
        }
       {error&&
       error
       }
       {
         result&&
         <p>{date.getHours()} o'clock<br/>Historical data shows that there will be {result} people.<br/>It is expected to be {result>30000?<>crowded..</>:<>vacant..</>}</p>
       }
       <a href="#" onClick={()=>graph?setGraph(false):setGraph(true)}><p>See Visualize Subway Crowding Data</p></a>
       {graph&&
        GrpahContents()
       }
       
      </header>
    </div>
  );
}

export default App;
