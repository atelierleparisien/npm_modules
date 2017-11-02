'use strict'
var http = require('request');

var DM = module.exports = {
    token: "",
    userId: "",
    dm_params: {
        scheme: "https",
        host: "api.dailymotion.com",
        tokenRoute: "/oauth/token"
    },
    userParams: {},
    setParams: function(infos) {
        this.userParams = infos;
    },
    getToken: function(callback) {
        if (this.userParams == {}) {
            callback({ error: "Aucun paramètres d'identification renseignés. Utilisez 'setParams'" });
        }
        var request = {
            "grant_type": "password",
            "username": this.userParams.clientUsername,
            "password": this.userParams.clientPassword,
            "client_id": this.userParams.clientId,
            "client_secret": this.userParams.clientSecret,
            "scope": "manage_videos"
        };
        http.post({
                headers: [{
                    name: 'content-type',
                    value: 'application/x-www-form-urlencoded'
                }],
                url: this.dm_params.scheme + "://" + this.dm_params.host + this.dm_params.tokenRoute,
                form: request
            },
            function(err, httpResponse, body) {
                body = JSON.parse(body);
                if (err == null && typeof body.access_token != "undefined") {
                    DM.token = body.access_token;
                    DM.userId = body.uid;

                    callback(this.token);
                } else {
                    callback(err);
                }

            });

    },
    getUserVideos: function(token, callback, page, limit) {
        if (page == null) {
            page = 1;
        }
        if (limit == null) {
            limit = 100;
        }
        http.get({
                headers: [{
                    name: 'content-type',
                    value: 'application/x-www-form-urlencoded'
                }, {
                    name: "Authorization",
                    value: "Bearer " + token
                }],
                url: DM.dm_params.scheme + "://" + DM.dm_params.host + '/user/' + DM.userId + '/videos?page=' + page + '&limit=' + limit + '&fields=id,title,channel,tags,created_time,likes_total,thumbnail_url,views_last_hour,views_last_day,views_last_week,views_last_month,views_total'
            },
            function(err, httpResponse, body) {

                if (err == null) {
                    body = JSON.parse(body);
                    body.list.map(function(video) {
                        video.tags = video.tags.join();
                        video.created_time = video.created_time * 1000;
                    })
                    callback(body);
                }

            });
    },
    getAllUserVideos: function(token, offset, completedCallBack) {
        var heap = [];
        DM.getUserVideos(token, function(res,stateHeap) {
            if (res.has_more == false) {
                completedCallBack(stateHeap);
            } else {
                stateHeap.push(res.list);
                var page = res.page + 1;

                DM.getAllUserVideos(token, page, completedCallBack, stateHeap)
            }
        }, offset, 100);
    }
}