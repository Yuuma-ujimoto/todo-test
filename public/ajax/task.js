function get_task(){

        $.ajax({
            url: "/api/get-task",
            dataType: "json",
            type: "post"
        }).then(
            (result) => {
                console.log("r", result)
                if(result.error){
                    return
                }
                $("#result").empty()
                let html
                result.result.forEach(items=>{
                    html = `
                    <div class="card mt-3 mb-3">
                        <div class="card-header"><h4>Task</h4></div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <p id="mail_address">${items.task_contents}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                    $("#result").append(html)
                })
            },
            (error) => {
                console.log("e")
            }
        )


}

$(()=>{
    get_task()
    const task_contents = $("#task_contents")
    $("#submit-button").on("click",()=>{
        $.ajax({
            url:"/api/add-task",
            dataType:"json",
            type:"post",
            data:{
                task_contents: task_contents.val()
            }
        }).then(
            (result)=>{
                console.log("r")
                console.log(result)
                if(result.error){
                    $("#error").fadeIn()
                    return
                }
                get_task()
            },
            (error)=>{
                console.log("e")

                get_task()
            }
        )
        task_contents.val('')
    })
})