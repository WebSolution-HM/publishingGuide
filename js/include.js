// header & aside
document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[dataincludes]");

  // ✅ fetch들을 배열로 만들고 Promise.all로 대기
  const fetches = Array.from(includes).map(async (el) => {
    const file = el.getAttribute("dataincludes");
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`❌ ${file} not found`);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      el.innerHTML = `<div style="color:red">Include failed: ${file}</div>`;
      console.error(err);
    }
  });


  /**
   * 함수들 실행
  */
  Promise.all(fetches).then(() => {
    /*공통변수 모음*/
    const cardWrap = document.querySelectorAll(".js-guide-li-wrap");
    const allCards = [];
    const firstCardTop = [];
    const indicatorMenu = document.querySelectorAll(".js-indicator--menu button");
    const topBtn = document.querySelector(".js-btn--top")
    const indicatorLine = document.querySelector(".indicator--line");
    const cardEls = document.querySelectorAll(".js-guide-card");
    const ulEls = document.querySelectorAll(".js-guide-li-wrap");




    /* 함수 모음 */
    //랜덤숫자(최소, 최대)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function setCardPositions(cardEls) {
      //left 값
      cardEls.forEach(card => {
        const randomL = getRandomInt(5, 30);
        card.style.marginLeft = `${randomL}vw`;
      });
    }

    //배열 설정
    function setFirstCardTop () {
      ulEls.forEach((ul, index) => {
        firstCardTop.push({
            index: index,
            top: parseFloat(ul.style.top)-250 || ul.offsetTop-250
        });
      });
    };

    //scroll indicator(스크롤 인디케이터) 영역
    function initScrollIndicator() {
      window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollable = documentHeight - windowHeight;
        const progress = scrollTop / scrollable;
        const percent = Math.min(Math.max(progress * 100, 0), 100);

        //인디케이터 라인
        updateIndicatorLine();

        //인디케이터 메뉴
        indicatorMenu.forEach(btn => btn.classList.remove("active"));
        for (let i = 0; i < firstCardTop.length - 1; i++) {
            if (scrollTop >= firstCardTop[i].top && scrollTop < firstCardTop[i + 1].top) {
                indicatorMenu[firstCardTop[i].index].classList.add("active");
            }
        }
        
        if (scrollTop+ windowHeight >= documentHeight) {
            indicatorMenu.forEach(btn => btn.classList.remove("active"));
            indicatorMenu[indicatorMenu.length-1].classList.add("active");
        } else {
            return;
        }
      });
    }

    //인디케이터 라인
    function updateIndicatorLine() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollable = documentHeight - windowHeight;
      const progress = scrollTop / scrollable;
      let percent = Math.min(Math.max(progress * 100, 0), 100);

      if(!scrollable>0){
          percent=100;
      }else {
          percent = Math.min(Math.max(progress * 100, 0), 100);  
      }
      
      indicatorLine.style.background = `linear-gradient(
          to bottom, 
          #006FFD ${percent}%, 
          #c9c9c9 ${percent}%
      )`;
    }
      
    //스크롤 인디케이터 버튼
    function scrollIndicator() {
      indicatorMenu.forEach((btn, i)=>{
        btn.addEventListener("click", ()=>{
          window.scrollTo({
            top: firstCardTop[i].top,
            behavior: "smooth"
          });
        });
      });
    };
    



    /*실행부*/
    setFirstCardTop();
    setCardPositions(cardEls);
    cardWrap.forEach((ul) => {
      const cardEls = ul.querySelectorAll(".js-guide-card");
      cardEls.forEach(c => allCards.push(c));
      cardEls.forEach(c => c.style.opacity = 1);
    });

    setTimeout(() => {
      initScrollIndicator();
      scrollIndicator()
      updateIndicatorLine();
    }, 30);

    /*li색상*/
    allCards.forEach((li, index)=>{
      if(index%2 != 0){
        li.querySelector(".title--guide").style.backgroundColor = "#FF5900";
        li.querySelector(".sample-code").style.boxShadow = " 12px 12px 0 0 #FF5900";
      }
    });

    /*탑버튼*/
    topBtn.addEventListener("click", ()=>{
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    })

    /*스크롤이 브라우저를 넘어가기 시작한 경우*/
    //인디케이터 나타나기
    //top 버튼 나타나기
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      //인디케이터 나타나기
      if(scrollTop <= 0){
        indicatorLine.style.opacity = 0;
      }else {
        indicatorLine.style.opacity = 1;
      }

      //top 버튼 나타나기
      if (scrollTop > viewportHeight) {
        topBtn.style.opacity = 1;
        topBtn.style.transform = "translateY(0)";
      } else {
        topBtn.style.opacity = 0;
        topBtn.style.transform = "translateY(10vh)";
      }
    });

    const navBtn = document.querySelectorAll(".nav-wrap li button");
    const pageName = window.location.pathname.split("/").pop().split(".")[0];
    switch (pageName) {
      case "htmlguide":
        navBtn[1].classList.add("active");
      break;
      case "cssguide":
        navBtn[2].classList.add("active");
      break;
      default:
        navBtn[0].classList.add("active");
      break;
    }



  });
});
