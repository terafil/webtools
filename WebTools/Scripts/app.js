/// <reference path="treeView.js" />
function init()
{
    var leafs = [
        {
            title: 'this is a parent',
            children: [
                {
                    title: 'this is a second parent',
                    children: [
                        {
                            title: 'this is a child',
                        }
                    ]
                }
            ]
        },
        {
            title: 'this is a second parent',
            children: [
                {
                    title: 'this is a child',
                    collapsed: true,
                    /*onExpand: function()
                    {
                        this.children = [
                            {
                                title: 'this is a grandchild'
                            }
                        ];
                    },*/
                    onExpandAsync: function(asyncCallback)
                    {
                        var xmlHttp = new XMLHttpRequest();
                        xmlHttp.currentLeaf = this;

                        xmlHttp.onreadystatechange = function () {
                            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                                this.currentLeaf.children = JSON.parse(xmlHttp.responseText);
                                asyncCallback.expand();
                            }
                        }
                        xmlHttp.open("GET", "api/v1/tree/leafs", true);
                        xmlHttp.send();
                    },
                    onCollapse: function()
                    {
                        this.children = [];
                    }
                }
            ]
        }

    ];

    var config = {
        leafs: leafs,
        containerId: 'treeContainer'
    }

    var view = new treeView(config);
}