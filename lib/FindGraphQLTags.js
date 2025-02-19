"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
var ts = require("typescript");
var util = require("util");
function isCreateContainerFunction(fnName) {
    return (fnName === "createFragmentContainer" ||
        fnName === "createRefetchContainer" ||
        fnName === "createPaginationContainer");
}
function isCreateContainerCall(callExpr) {
    var callee = callExpr.expression;
    return ((ts.isIdentifier(callee) && isCreateContainerFunction(callee.text)) ||
        (ts.isPropertyAccessExpression(callee) &&
            ts.isIdentifier(callee.expression) &&
            callee.expression.text === "Relay" &&
            isCreateContainerFunction(callee.name.text)));
}
function createContainerName(callExpr) {
    if (ts.isIdentifier(callExpr.expression) &&
        isCreateContainerFunction(callExpr.expression.text)) {
        return callExpr.expression.text;
    }
    if (ts.isPropertyAccessExpression(callExpr.expression) &&
        ts.isIdentifier(callExpr.expression.expression) &&
        callExpr.expression.expression.text === "Relay") {
        if (isCreateContainerFunction(callExpr.expression.name.text)) {
            return callExpr.expression.name.text;
        }
    }
    throw new Error("Not a relay create container call");
}
function visit(node, addGraphQLTag) {
    function visitNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression: {
                var callExpr_1 = node;
                if (isCreateContainerCall(callExpr_1)) {
                    var fragmentSpec = callExpr_1.arguments[1];
                    if (fragmentSpec == null) {
                        break;
                    }
                    if (ts.isObjectLiteralExpression(fragmentSpec)) {
                        fragmentSpec.properties.forEach(function (prop) {
                            invariant(ts.isPropertyAssignment(prop) &&
                                prop.questionToken == null &&
                                ts.isIdentifier(prop.name) &&
                                ts.isTaggedTemplateExpression(prop.initializer), "FindGraphQLTags: `%s` expects fragment definitions to be " +
                                "`key: graphql`.", createContainerName(callExpr_1));
                            // We tested for this
                            var propAssignment = prop;
                            var taggedTemplate = propAssignment.initializer;
                            invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                                "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                            addGraphQLTag({
                                keyName: propAssignment.name.text,
                                template: getGraphQLText(taggedTemplate),
                                sourceLocationOffset: getSourceLocationOffset(taggedTemplate),
                            });
                        });
                    }
                    else {
                        invariant(ts.isTaggedTemplateExpression(fragmentSpec), "FindGraphQLTags: `%s` expects a second argument of fragment " +
                            "definitions.", createContainerName(callExpr_1));
                        var taggedTemplate = fragmentSpec;
                        invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                            "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                        addGraphQLTag({
                            keyName: null,
                            template: getGraphQLText(taggedTemplate),
                            sourceLocationOffset: getSourceLocationOffset(taggedTemplate),
                        });
                    }
                    // Visit remaining arguments
                    for (var i = 2; i < callExpr_1.arguments.length; i++) {
                        visit(callExpr_1.arguments[i], addGraphQLTag);
                    }
                    return;
                }
                break;
            }
            case ts.SyntaxKind.TaggedTemplateExpression: {
                var taggedTemplate = node;
                if (isGraphQLTag(taggedTemplate.tag)) {
                    // TODO: This code previously had no validation and thus no
                    //       keyName/sourceLocationOffset. Are these right?
                    addGraphQLTag({
                        keyName: null,
                        template: getGraphQLText(taggedTemplate),
                        sourceLocationOffset: getSourceLocationOffset(taggedTemplate),
                    });
                }
            }
        }
        ts.forEachChild(node, visitNode);
    }
    visitNode(node);
}
function isGraphQLTag(tag) {
    return (tag.kind === ts.SyntaxKind.Identifier &&
        tag.text === "graphql");
}
function getTemplateNode(quasi) {
    invariant(quasi.template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral, "FindGraphQLTags: Substitutions are not allowed in graphql tags.");
    return quasi.template;
}
function getGraphQLText(quasi) {
    return getTemplateNode(quasi).text;
}
function getSourceLocationOffset(quasi) {
    var pos = getTemplateNode(quasi).pos;
    var loc = quasi.getSourceFile().getLineAndCharacterOfPosition(pos);
    return {
        line: loc.line + 1,
        column: loc.character + 1,
    };
}
function invariant(condition, msg) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        throw new Error(util.format.apply(util, __spreadArray([msg], __read(args))));
    }
}
var find = function (text, filePath) {
    var result = [];
    var ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);
    visit(ast, function (tag) { return result.push(tag); });
    return result;
};
exports.find = find;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmluZEdyYXBoUUxUYWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ZpbmRHcmFwaFFMVGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFDakMsMkJBQTZCO0FBTzdCLFNBQVMseUJBQXlCLENBQ2hDLE1BQWM7SUFLZCxPQUFPLENBQ0wsTUFBTSxLQUFLLHlCQUF5QjtRQUNwQyxNQUFNLEtBQUssd0JBQXdCO1FBQ25DLE1BQU0sS0FBSywyQkFBMkIsQ0FDdkMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFFBQTJCO0lBQ3hELElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDbkMsT0FBTyxDQUNMLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkUsQ0FBQyxFQUFFLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNsQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxPQUFPO1lBQ2xDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDL0MsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUMxQixRQUEyQjtJQUszQixJQUNFLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUNwQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUNuRDtRQUNBLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7S0FDakM7SUFDRCxJQUNFLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ2xE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