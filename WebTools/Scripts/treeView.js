function treeView(config)
{

    buildTreeView();

    function buildTreeView()
    {
        if (config.leafs && config.leafs.constructor !== Array)
            throw new Error("config.leafs must be an array");

        var container = document.getElementById(config.containerId);

        if (config.leafs && config.leafs.constructor === Array) {
            var list = document.createElement('ul');
            list.style.listStyleType = 'none';

            for (var i = 0; i < config.leafs.length; ++i)
            {
                list.appendChild(buildLeaf(config.leafs[i]));
            }

            container.appendChild(list);
        }
    }
    function buildLeaf(leaf)
    {
        if (!Object.prototype.hasOwnProperty.call(leaf, 'collapsed')) { 
            leaf.collapsed = false;
        }

        var listItem = document.createElement("li");

        if (leaf.children || leaf.onExpand || leaf.onExpandAsync) {
            var indicatorContainer = document.createElement("i");
            indicatorContainer.className = leaf.collapsed ? 'fa fa-minus-square' : 'fa fa-plus-square';
            indicatorContainer.style.display = 'table-cell';
            indicatorContainer.style.cursor = "pointer";
            indicatorContainer.onclick = function () { toggleState(indicatorContainer, leaf); };

            listItem.appendChild(indicatorContainer);
        }

        var titleContainer = document.createElement("div");
        titleContainer.style.display = 'table-cell';
        titleContainer.innerText = leaf.title;

        listItem.appendChild(titleContainer);

        if (leaf.children && leaf.children.constructor === Array && leaf.children.length > 0) {
            var childList = createChildContainer(leaf.collapsed);

            populateChildContainer(childList, leaf);

            listItem.appendChild(childList);

        }

        return listItem;
    }

    function createChildContainer(isCollapsed)
    {
        var list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.display = isCollapsed ? 'none' : '';

        return list;
    }
    function populateChildContainer(childContainer, leaf)
    {
        for (var i = 0; i < leaf.children.length; ++i) {
            childContainer.appendChild(buildLeaf(leaf.children[i], leaf.collapsed));
        }
    }

    function toggleState(container, leaf)
    {
        container.className = 'fa fa-spinner fa-spin';
        leaf.collapsed = !leaf.collapsed;

        if (!leaf.collapsed)
        {
            if(leaf.onExpand) {
                leaf.onExpand();
            }
            else if(leaf.onExpandAsync)
            {
                var callback = {
                    source: this,
                    expand: function()
                    {
                        continueExpansion(container, leaf);
                    }
                };
                leaf.onExpandAsync(callback);
                return;
            }
        }
        else if (leaf.collapsed && leaf.onCollapse) {
            leaf.onCollapse();
        }

        continueExpansion(container, leaf);
    }
    function continueExpansion(container, leaf)
    {
        var childContainer;
        // Find child list container
        for (var i = 0; i < container.parentElement.children.length; ++i) {
            var element = container.parentElement.children[i];

            if (element.tagName == 'UL') {
                childContainer = element;
                break;
            }
        }


        if (childContainer) {
            if (leaf.children.length == 0) {
                container.parentElement.removeChild(childContainer);
            }
            else {
                childContainer.style.display = leaf.collapsed ? 'none' : '';
            }
        }
        else if (leaf.children && leaf.children.length > 0) {
            var childContainer = createChildContainer(leaf.collapsed);
            populateChildContainer(childContainer, leaf);
            container.parentElement.appendChild(childContainer);

        }

        container.className = leaf.collapsed ? 'fa fa-minus-square' : 'fa fa-plus-square';
    }
}
