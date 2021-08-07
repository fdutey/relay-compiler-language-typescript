"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCompilerOptions = void 0;
var ts = require("typescript");
var loadCompilerOptions = function () {
    var configFileName = ts.findConfigFile(process.cwd(), ts.sys.fileExists);
    if (!configFileName) {
        return {};
    }
    var configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
    if (configFile.error) {
        return {};
    }
    // parse config file contents (to convert strings to enum values etc.)
    var parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./");
    if (parsedConfig.errors.length > 0) {
        return {};
    }
    return parsedConfig.options;
};
exports.loadCompilerOptions = loadCompilerOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZENvbXBpbGVyT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkQ29tcGlsZXJPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUFpQztBQUUxQixJQUFNLG1CQUFtQixHQUFHO0lBQ2pDLElBQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0UsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNuQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELHNFQUFzRTtJQUN0RSxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQ2hELFVBQVUsQ0FBQyxNQUFNLEVBQ2pCLEVBQUUsQ0FBQyxHQUFHLEVBQ04sSUFBSSxDQUNMLENBQUM7SUFDRixJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNsQyxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQW5CVyxRQUFBLG1CQUFtQix1QkFtQjlCIn0=