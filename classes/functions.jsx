// import { getPics } from "./main.jsx";

// var auth = require('../objects/auth');
// var s3 = require('../objects/s3');

import { Display } from "./Display.jsx";

var getPics = function (s3, items) {
    document.querySelector('.w3-animate-fading').innerHTML = '';
    var domContainer = document.querySelector('#react');
    ReactDOM.render(<Display items={items} client={s3} />, domContainer);
}

var getData = function (s3) {

    document.querySelector('.w3-animate-fading').innerHTML = '';
    ReactDOM.unmountComponentAtNode(document.querySelector('#react'));
    if (!s3) {
        alert('You are not signed in.');
        return;
    }

    var items = [];

    s3.listObjectsV2(
        {
            Bucket: 'aws-cognito-resources'
        },
        function (err, data) {
            if (err) {
                document.querySelector('.w3-animate-fading').append(err.message);
                return;
            } else {
                document.querySelector('.w3-animate-fading').append(`Loading ${data.Contents.length}`);
            }
            var count = 0;
            var noItems = true;
            data.Contents.forEach(function (item, index, array) {

                if (item.Key.indexOf('/') < 0) {
                    noItems = false;
                    s3.getObject(
                        {
                            Bucket: 'aws-cognito-resources',
                            Key: item.Key
                        },
                        function (err, data) {
                            if (err) throw err;
                            items.push(
                                {
                                    Key: item.Key,
                                    Body: data.Body
                                }
                            );
                            console.log(items.length + " " + array.length + " " + count + " " + item.Size);
                            if (items.length == array.length - count) {
                                getPics(s3, items);
                            }
                        }
                    );
                } else {
                    count++;
                }
            });
            if (noItems) document.querySelector('.w3-animate-fading').innerHTML= 'No items';
        }
    );
}

var getApproved = function (s3) {

    document.querySelector('.w3-animate-fading').innerHTML = '';
    ReactDOM.unmountComponentAtNode(document.querySelector('#react'));
    if (!s3) {
        alert('You are not signed in.');
        return;
    }

    var items = [];

    s3.listObjectsV2(
        {
            Bucket: 'aws-cognito-resources',
            Prefix: 'approved/'
        },
        function (err, data) {
            if (err) {
                document.querySelector('.w3-animate-fading').append(err.message);
                return;
            } else {
                document.querySelector('.w3-animate-fading').append(`Loading ${data.Contents.length}`);
            }
            var count = 0;
            var noItems = true;
            data.Contents.forEach(function (item, index, array) {

                if (item.Key.length > 10) {
                    noItems = false;
                    s3.getObject(
                        {
                            Bucket: 'aws-cognito-resources',
                            Key: item.Key
                        },
                        function (err, data) {
                            if (err) throw err;
                            items.push(
                                {
                                    Key: item.Key,
                                    Body: data.Body
                                }
                            );
                            console.log(items.length + " " + array.length + " " + count + " " + item.Size);
                            if (items.length == array.length - count) {
                                getPics(s3, items);
                            }
                        }
                    );
                } else {
                    count++;
                }
            });
            if (noItems) document.querySelector('.w3-animate-fading').innerHTML = 'No items';
        }
    );
}

var deletePic = function (s3, key) {
    s3.deleteObject(
        {
            Bucket: 'aws-cognito-resources',
            Key: key
        },
        function (err, data) {
            if (err) {
                alert(err.message);
                console.log(err);
            } else {
                console.log(data);
                alert('Deleted successfully');
            }
        }
    );
}

var approvePic = function (s3, key) {
    s3.copyObject(
        {
            Bucket: 'aws-cognito-resources',
            CopySource: `aws-cognito-resources/${key}`,
            Key: `approved/${key}`
        },
        function (err, data) {
            if (err) {
                alert(err.message);
                console.log(err);
            } else {
                alert(JSON.stringify(data.CopyObjectResult));
                console.log(data);
                deletePic(s3, key);
            }
        }
    );
}

var uploadPic = function (s3) {
    if (!s3) {
        alert('You are not signed in.');
        return;
    }
    var file = document.querySelector('input').files[0];
    var title = document.getElementsByName('title')[0].value;

    console.log(title)
    s3.upload(
        {
            Bucket: 'aws-cognito-resources',
            Key: title,
            Body: file
        },
        null,
        function (err, response) {
            if (err) {
                alert(err.message);
                console.log(err);
            } else {
                console.log(response);
                alert(`${response.key} was successfully uploaded to ${response.Bucket}.`);
            }

        }
    );
};

export {
    getData,
    getApproved,
    deletePic,
    approvePic,
    uploadPic
}