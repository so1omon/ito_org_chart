# Github command guide #

1. git init : 해당 디렉토리에 .git 생성 (github와 연동 시작)

2. git config --global user.name "[Github ID]" : 로컬 pc에 깃허브 id 연동정보 넣기
   git config --global user.email "[Github email]" : 로컬 pc에 깃허브 email 연동정보 넣기
   cf) --global 옵션을 주지 않으면 레포지토리 단위(디렉토리 단위)로 설정값을 변경할 수 있음

3. git remote add origin [repository URL] : github에 업로드된 레포지토리 url을 원격 레포지토리로 설정 (origin이라는 이름으로 사용)

4. git remote -v : 연결된 원격 레포지토리 목록 확인

5. git pull origin master : 원격 레포지토리에서 가져오기
   cf) pull은 fetch와 merge를 동시에 수행해주기 때문에, ![rejected] 오류 메세지가 나오면 다음 방법으로 레포지토리 내용을 가져온다.

   1) git status로 스테이징 상태 체크 및 add, commit해주기
   2) git fetch --all
   3) git merge origin/master

6. git status : git 스테이징 내용 확인(Modified, Added, Deleted 정보 모두 반영)

7. git add . : 현재 디렉토리 내의 모든 변경사항을 스테이징

8. git commit [-a] [-m "message"] : 스테이징된 내용 커밋하기 
   [-a] : git add + git commit을 수행
   [-m "message"] : 커밋 comments 추가

9. git push [-u] origin master : 커밋 내용을 원격 레포지토리에 업로드
   [-u] : 최초 푸시할 때만 사용하기

10. .gitignore에 있는 내용들은 스테이징, 커밋 대상에서 제외
   ex) create.js : create.js 파일만 ingore
       node_modules/ : node_modules라는 디렉토리 내용은 전부 ignore
       *.exe : 확장자가 exe인 파일들은 전부 ignore

</br></br>

참고 - 의존 파일 생성해야 함
1. ./login_info.js
``` javascript
const requestIp=require('request-ip')
module.exports={
    options: {
        host:{HOST},
        user:{USER},
        password:{PASSWORD},
        database:{DATABASE},
        clearExpired: true,
        checkExpirationInterval:10000,
        expiration:60000,
        connectionLimit: 1,
        endConnectionOnClose:true,
    },
    get_ip : function(req){
        const connection_info=requestIp.getClientIp(req).split(':'); // req 헤더정보 분리
        let ip='localhost';
        if(connection_info.length==4){ // ipv4 추출
            ip=connection_info[3];
        }
        return ip;
    }
};
```

2. ./db_connect.js
``` javascript
const mysql=require('mysql');

module.exports={
    db_info : {
        host:{HOST},
        user:{USER},
        password:{PASSWORD},
        database:{DATABASE},
    },
    init:function(){
        return mysql.createConnection(db_info);
    },
    connect: function(conn){
        conn.connect(function(err){
            if(err) console.error("mysql connection error : " + err);
            else console.log('mysql is connected successfully.');
        })
    },
    user : process.env.NODE_ORACLEDB_USER , 
    password : process.env.NODE_ORACLEDB_PASSWOR, 
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    sleep : function(ms){
        const wakeUpTime = Date.now() + ms;
        while (Date.now() < wakeUpTime) {}
    },
    emp_info_sync_query:`insert into good.emp_info 
    SELECT NULL, A.emp_id, A.emp_nm as 'emp_name', IFNULL(A.mobile_no,'None') as mobile_no, 
    IFNULL(A.office_tel_no,'None') as office_tel_no , A.org_nm as dept_name, 
    IFNULL(A.mail_addr,'None') as mail_addr, IFNULL(A.roll_info,'None') as roll_info, 
    IFNULL(C.post_nm, 'None') as post_name, IFNULL(C.duty_nm, 'None') as duty_name,
    IFNULL(B.URL,'None') as img_url FROM connect.hr_info as A 
    LEFT JOIN connect.gw_pic_info as B ON A.emp_id=B.emp_code 
    RIGHT JOIN (SELECT distinct emp_id, post_nm, duty_nm from connect.inf_app 
        WHERE (emp_id, sta_ymd, SEQ_NO) IN (
            SELECT emp_id, sta_ymd, MAX(SEQ_NO) AS SEQ_NO FROM connect.inf_app 
            WHERE (emp_id, sta_ymd) in(
                SELECT emp_id, MAX(sta_ymd) AS sta_ymd FROM (
                    SELECT emp_id, sta_ymd, SEQ_NO FROM connect.inf_app WHERE emp_id not in (
                        SELECT emp_id FROM connect.inf_app WHERE appnt_nm IN('퇴직','파견계약해지')
                    )
                )w GROUP BY emp_id)
            GROUP BY emp_id)
        AND appnt_nm NOT IN ('직급대우해지') 
        AND emp_nm NOT IN ('테과장','테스트')) AS C ON A.emp_id=C.emp_id`,
    seat_info_sync_query_1:`INSERT INTO good.seat_info(emp_id, emp_name, dept_name, post_name, seat_arrng) 
    SELECT emp_id, emp_name, dept_name, post_name, -1 FROM good.emp_info 
    WHERE (emp_id, emp_name, dept_name, post_name) NOT IN (
        SELECT emp_id, emp_name, dept_name, post_name FROM seat_info
    )`,
    seat_info_sync_query_2:`DELETE FROM good.seat_info 
    WHERE (emp_id, emp_name, dept_name, post_name) NOT IN (
        SELECT emp_id, emp_name, dept_name, post_name FROM good.emp_info
    )`,
    
}


```
