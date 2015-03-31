function treeView(config) {
    // build the tree
    buildTreeView();
    // builds the tree veiw 
    function buildTreeView() {
        // verify that the config.leafs is an array
        if (config.leafs && config.leafs.constructor !== Array)
            throw new Error("config.leafs must be an array");
        // Find the tree container
        var container = document.getElementById(config.containerId);
        // If we have leafs then start creating the tree
        if (config.leafs) {
            // Create the leaf container
            var list = createChildContainer(false);
            // build the dom for each leaf and add it to the list
            for (var i = 0; i < config.leafs.length; ++i) {
                list.appendChild(buildLeaf(config.leafs[i]));
            }
            // append the tree to the container
            container.appendChild(list);
        }
    }
    // Returns a Node which contains the leaf information and all of it's children.
    function buildLeaf(leaf) {
        // If this leaf does not have the collapsed field then add it.
        if (!Object.prototype.hasOwnProperty.call(leaf, 'collapsed')) {
            leaf.collapsed = false;
        }

        // Create the list item element
        var listItem = document.createElement("li");

        // If this leaf can be expanded then create the expand / collapse element
        if (leaf.children || leaf.onExpand || leaf.onExpandAsync) {
            var indicatorContainer = document.createElement("i");
            indicatorContainer.className = leaf.collapsed ? 'fa fa-minus-square' : 'fa fa-plus-square';
            indicatorContainer.style.display = 'table-cell';
            indicatorContainer.style.cursor = "pointer";
            indicatorContainer.onclick = function () { toggleState(indicatorContainer, leaf); };
            // add the expand / collapse element to the list item
            listItem.appendChild(indicatorContainer);
        }
        // Create the title element
        var titleContainer = document.createElement("div");
        titleContainer.style.display = 'table-cell';
        titleContainer.innerText = leaf.title;
        // Add the title element to the list item
        listItem.appendChild(titleContainer);
        // If the leaf has children then create the child list
        if (leaf.children && leaf.children.constructor === Array && leaf.children.length > 0) {
            // Create the child list container
            var childList = createChildContainer(leaf.collapsed);
            // add the leafs children to the child list container
            populateChildContainer(childList, leaf);
            // Add the child list container to the list item
            listItem.appendChild(childList);
        }

        return listItem;
    }
    // Create an unordered list and sets its display based on whether it is collapsed
    function createChildContainer(isCollapsed) {
        var list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.display = isCollapsed ? 'none' : '';

        return list;
    }
    // Iterates through the children of a leaf and appends them to the list
    function populateChildContainer(childContainer, leaf) {
        for (var i = 0; i < leaf.children.length; ++i) {
            childContainer.appendChild(buildLeaf(leaf.children[i], leaf.collapsed));
        }
    }
    // Switches the state between expanded and collapsed
    function toggleState(container, leaf) {
        // Set the icon to a progress spinner
        container.className = 'fa fa-spinner fa-spin';

        // toggle the collapsed state
        leaf.collapsed = !leaf.collapsed;

        // determine if a method needs to be called when collapsing or expanding
        if (!leaf.collapsed) {
            if (leaf.onExpand) {
                leaf.onExpand();
            }
            else if (leaf.onExpandAsync) {
                var callback = {
                    source: this,
                    expand: function () {
                        continueExpansion(container, leaf);
                    }
                };
                leaf.onExpandAsync(callback);
                // If calling an async method then do not continue expansion
                return;
            }
        }
        else if (leaf.collapsed && leaf.onCollapse) {
            leaf.onCollapse();
        }
        // continue expansion
        continueExpansion(container, leaf);
    }
    // continue expanding or collapsing the leaf
    function continueExpansion(container, leaf) {
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
