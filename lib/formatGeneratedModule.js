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
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatterFactory = void 0;
var ts = require("typescript");
var addAnyTypeCast_1 = require("./addAnyTypeCast");
var createRequireRegex = function () { return /require\('(.*)'\)/g; };
function getModuleName(path) {
    var _a = __read(path.replace("./", "").split("."), 1), moduleName = _a[0];
    return moduleName;
}
// collects all require calls and converts them top-level imports
var requireToImport = function (content) {
    var requireRegex = createRequireRegex();
    // collect all require paths (unique)
    var requirePaths = new Set();
    while (true) {
        var res = requireRegex.exec(content);
        if (res === null) {
            break;
        }
        requirePaths.add(res[1]);
    }
    // replace all require paths
    Array.from(requirePaths).forEach(function (requirePath) {
        content = content.replace("require('" + requirePath + "')", getModuleName(requirePath));
    });
    // create top-level imports
    var topLevelImports = Array.from(requirePaths)
        .sort()
        .map(function (requirePath) {
        return "import " + getModuleName(requirePath) + " from \"" + requirePath.replace(".ts", "") + "\";";
    });
    // add top-level imports
    content = topLevelImports.join("\n") + "\n" + content;
    return content;
};
function formatContent(rawContent, options) {
    if (!options.replaceRequire) {
        return rawContent;
    }
    return requireToImport(rawContent);
}
var formatterFactory = function (compilerOptions) {
    if (compilerOptions === void 0) { compilerOptions = {}; }
    return function (_a) {
        var moduleName = _a.moduleName, documentType = _a.documentType, docText = _a.docText, concreteText = _a.concreteText, typeText = _a.typeText, hash = _a.hash, sourceHash = _a.sourceHash;
        var noImplicitAny = compilerOptions.noImplicitAny, _b = compilerOptions.module, module = _b === void 0 ? -1 : _b;
        var documentTypeImport = documentType
            ? "import { " + documentType + " } from \"relay-runtime\";"
            : "";
        var docTextComment = docText ? "\n/*\n" + docText.trim() + "\n*/\n" : "";
        var nodeStatement = "const node: " + (documentType || "never") + " = " + concreteText + ";";
        if (noImplicitAny) {
            nodeStatement = addAnyTypeCast_1.default(nodeStatement).trim();
        }
        var rawContent = (typeText || "") + "\n\n" + docTextComment + "\n" + nodeStatement + "\n(node as any).hash = '" + sourceHash + "';\nexport default node;\n";
        var content = "/* tslint:disable */\n/* eslint-disable */\n// @ts-nocheck\n" + (hash ? "/* " + hash + " */\n" : "") + "\n" + documentTypeImport + "\n" + formatContent(rawContent, {
            replaceRequire: module >= ts.ModuleKind.ES2015,
        });
        return content;
    };
};
exports.formatterFactory = formatterFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0R2VuZXJhdGVkTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Zvcm1hdEdlbmVyYXRlZE1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsK0JBQWlDO0FBQ2pDLG1EQUE4QztBQUU5QyxJQUFNLGtCQUFrQixHQUFHLGNBQU0sT0FBQSxvQkFBb0IsRUFBcEIsQ0FBb0IsQ0FBQztBQUV0RCxTQUFTLGFBQWEsQ0FBQyxJQUFZO0lBQzNCLElBQUEsS0FBQSxPQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBQSxFQUEvQyxVQUFVLFFBQXFDLENBQUM7SUFDdkQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUVELGlFQUFpRTtBQUNqRSxJQUFNLGVBQWUsR0FBRyxVQUFDLE9BQWU7SUFDdEMsSUFBTSxZQUFZLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztJQUUxQyxxQ0FBcUM7SUFDckMsSUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUN2QyxPQUFPLElBQUksRUFBRTtRQUNYLElBQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ2hCLE1BQU07U0FDUDtRQUNELFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUI7SUFDRCw0QkFBNEI7SUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFXO1FBQzNDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUN2QixjQUFZLFdBQVcsT0FBSSxFQUMzQixhQUFhLENBQUMsV0FBVyxDQUFDLENBQzNCLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUNILDJCQUEyQjtJQUMzQixJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUM3QyxJQUFJLEVBQUU7U0FDTixHQUFHLENBQ0YsVUFBQyxXQUFXO1FBQ1YsT0FBQSxZQUFVLGFBQWEsQ0FBQyxXQUFXLENBQUMsZ0JBQVUsV0FBVyxDQUFDLE9BQU8sQ0FDL0QsS0FBSyxFQUNMLEVBQUUsQ0FDSCxRQUFJO0lBSEwsQ0FHSyxDQUNSLENBQUM7SUFDSix3QkFBd0I7SUFDeEIsT0FBTyxHQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQ3ZDLE9BQVMsQ0FBQztJQUNWLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQU1GLFNBQVMsYUFBYSxDQUNwQixVQUFrQixFQUNsQixPQUE2QjtJQUU3QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtRQUMzQixPQUFPLFVBQVUsQ0FBQztLQUNuQjtJQUNELE9BQU8sZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFTSxJQUFNLGdCQUFnQixHQUFHLFVBQzlCLGVBQXdDO0lBQXhDLGdDQUFBLEVBQUEsb0JBQXdDO0lBQ3ZCLE9BQUEsVUFBQyxFQVFuQjtZQVBDLFVBQVUsZ0JBQUEsRUFDVixZQUFZLGtCQUFBLEVBQ1osT0FBTyxhQUFBLEVBQ1AsWUFBWSxrQkFBQSxFQUNaLFFBQVEsY0FBQSxFQUNSLElBQUksVUFBQSxFQUNKLFVBQVUsZ0JBQUE7UUFFRixJQUFBLGFBQWEsR0FBa0IsZUFBZSxjQUFqQyxFQUFFLEtBQWdCLGVBQWUsT0FBcEIsRUFBWCxNQUFNLG1CQUFHLENBQUMsQ0FBQyxLQUFBLENBQXFCO1FBRXZELElBQU0sa0JBQWtCLEdBQUcsWUFBWTtZQUNyQyxDQUFDLENBQUMsY0FBWSxZQUFZLCtCQUEwQjtZQUNwRCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLElBQUksYUFBYSxHQUFHLGtCQUNsQixZQUFZLElBQUksT0FBTyxZQUNuQixZQUFZLE1BQUcsQ0FBQztRQUN0QixJQUFJLGFBQWEsRUFBRTtZQUNqQixhQUFhLEdBQUcsd0JBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN0RDtRQUNELElBQU0sVUFBVSxHQUFHLENBQUcsUUFBUSxJQUFJLEVBQUUsYUFFcEMsY0FBYyxVQUNkLGFBQWEsZ0NBQ1MsVUFBVSwrQkFFakMsQ0FBQztRQUVBLElBQU0sT0FBTyxHQUFHLGtFQUdoQixJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQU0sSUFBSSxVQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FDN0Isa0JBQWtCLFVBQ2xCLGFBQWEsQ0FBQyxVQUFVLEVBQUU7WUFDMUIsY0FBYyxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU07U0FDL0MsQ0FBRyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztBQXRDa0IsQ0FzQ2xCLENBQUM7QUF4Q1csUUFBQSxnQkFBZ0Isb0JBd0MzQiJ9