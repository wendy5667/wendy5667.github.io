// 當文件已經全載入至記憶體時，開始執行程式
$(document).ready(function() {
    // 清空 product-list
    $('#product-list').empty();
    $('#page').hide()
    $('#carouselExampleControls').hide()
    var items = null
    var pageCount = 20
    var showItems = (page) => {
        if (items == null) return
        var start = (page - 1) * pageCount
        var end = start + pageCount - 1
        $('#product-list').empty();
        for (var i = start; i <= end; i++) {
            newItem(items[i])
        }
    }

    var newItem = (item) => {
        $img = $('<img>').attr('class', 'image').attr('src', item.image)
        $h3 = $('<h3>').attr('class', 'name').text(item.name)
        $p = $('<p>').attr('class', 'price').text('NT$ ' + item.price)

        $item = $('<div>').attr('class', 'item').append($img).append($h3).append($p)
        $col = $('<div>').attr('class', 'col-*').append($item)

        $('#product-list').append($col)
    }

    var changePageColor = (now, pageNum) => {
        console.log(now)
        $('li').removeClass('active')
        $('li').removeClass('disabled')
        $('#' + now).addClass('active')
        $('a#next').attr('tabindex', '0').attr('aria-disabled', 'false')
        $('a#prev').attr('tabindex', '0').attr('aria-disabled', 'false')
        if (now == Math.floor(pageNum)) {
            $('li#next').addClass('disabled')
            $('a#next').attr('tabindex', '-1').attr('aria-disabled', 'true')
        }
        if (now == 1) {
            $('li#prev').addClass('disabled')
            $('a#prev').attr('tabindex', '-1').attr('aria-disabled', 'true')
        }
    }

    var pagenow = 1
    var newPage = (n) => {
        var pageNum = n / 20
        pageNum = (n % 20 != 0) ? pageNum + 1 : pageNum

        $('#page-number').empty()

        $la = $('<a>').attr('id', 'prev').attr('class', 'page-link').attr('href', '#').attr('tabindex', '-1').attr('aria-disabled', 'true').text('«')
        $la.on('click', function() {
            pagenow = pagenow - 1
            changePageColor(pagenow, pageNum)
            showItems(pagenow)
        })
        $lli = $('<li>').attr('id', 'prev').attr('class', 'page-item').addClass('disabled').append($la)

        $('#page-number').append($lli)

        // 插入分頁數字
        for (var i = 1; i <= pageNum; i++) {
            $a = $('<a>').attr('class', 'page-link').attr('href', '#').text(i)

            $a.on('click', function() {
                var i = $(this).text()
                pagenow = i
                changePageColor(pagenow, pageNum)
                showItems(Number(i))
            })

            var strActive = ((i == 1) ? ' active' : '')
            $li = $('<li>').attr('id', i.toString()).attr('class', 'page-item' + strActive).append($a)
            $('#page-number').append($li)

        }

        $ra = $('<a>').attr('id', 'next').attr('class', 'page-link').attr('href', '#').text('»')
        $ra.on('click', function() {
            pagenow = Number(pagenow) + 1
            changePageColor(pagenow, pageNum)
            showItems(pagenow)
        })
        $rli = $('<li>').attr('id', 'next').attr('class', 'page-item').append($ra)
        $('#page-number').append($rli)
    }

    $('#home').on('click', function() {
        $('#product-list').empty();
        $('#page').hide()
        $('#carouselExampleControls').hide()
        $('#video').show()
    })

    $('#query').on('click', function() {
        // $是jQuery的意思，兩者可互換
        $('#video').hide()
        $('#carouselExampleControls').show()
        $.get('https://js.kchen.club/B05505052/query', function(response) {
            if (response) {
                // 伺服器有回傳資料
                if (response.result) {
                    $('#product-list').empty();
                    // 資料庫有回傳資料
                    items = response.items

                    // for (var i = 0; i < items.length; i++) {
                    //     newItem(items[i])
                    // }

                    // 加了分頁效果，預設顯示第一頁
                    showItems(1)

                    // 顯示分頁和設定分頁的函式
                    $('#page').show()
                    newPage(items.length)

                } else {
                    $('#message').text('查無相關資料')
                    $('#dialog').modal('show')
                }
            } else {
                $('#message').text('伺服器出錯')
                $('#dialog').modal('show')
            }

            console.log(response)
        }, "json")
    })


    $('#submit').on('click', function() {
        if ($("#name").val() == "") {
            alert("你尚未填寫產品名稱");
            eval("document.form1['name'].focus()");
        } else if ($("#price").val() == "") {
            alert("你尚未填寫產品價格");
            eval("document.form1['price'].focus()");
        } else if ($("#count").val() == "") {
            alert("你尚未填寫庫存數量");
            eval("document.form1['count'].focus()");
        } else if ($("#image").val() == "") {
            alert("你尚未填寫圖片網址");
            eval("document.form1['image'].focus()");
        } else {
            var product = {
                item: {
                    name: $("#name").val(),
                    price: Number($("#price").val()),
                    count: Number($("#count").val()),
                    image: $("#image").val()
                }

            }
            console.log(product.name)
            console.log(product.price)
            console.log(product.count)
            console.log(product.image)
            $.post('https://js.kchen.club/B05505052/insert', product, function(response) {
                if (response) {
                    // 伺服器有回傳資料
                    if (response.result) {


                    } else {
                        $('#message').text('無法新增')
                        $('#dialog').modal('show')
                    }
                } else {
                    $('#message').text('伺服器出錯')
                    $('#dialog').modal('show')
                }
            })
        }
    })

})