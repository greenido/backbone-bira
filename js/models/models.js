window.Beer = Backbone.Model.extend({
    endpoint: function() {
        return gapi.client.birra.beers;
    },

    initialize: function () {
        this.validators = {};

        this.validators.beerName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.score = function (value) {
            return value >= 0 && value <= 5 ? {isValid: true} : {isValid: false, message: "You must enter a score (1-5)"};
        };

        /*
        this.validators.country = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
		id: null,
        beerName: "",
		grapes: "",
		country: "",
		region: "",
		description: "",
		image: { value : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAACCCAYAAACNbQytAAAAGXRFWHRTb2Z0d2FyZQB" +
            "BZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iV" +
            "zVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2J" +
            "lIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6c" +
            "mRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ" +
            "9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvY" +
            "mUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHh" +
            "tcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNDgwMTE3NDA3MjA2ODExQkJDNUI4QTE4Rjk3MTE0RCIgeG1wTU06RG9jd" +
            "W1lbnRJRD0ieG1wLmRpZDo5QzBEQjFBMEFGODMxMUUxOTY3RkNBN0E3QTBCM0NDOSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo" +
            "5QzBEQjE5RkFGODMxMUUxOTY3RkNBN0E3QTBCM0NDOSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFja" +
            "W50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDU4MDExNzQwNzIwNjgxMUJCQzVCOEE" +
            "xOEY5NzExNEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDQ4MDExNzQwNzIwNjgxMUJCQzVCOEExOEY5NzExNEQiLz4gPC9yZ" +
            "GY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6jj9A/AAAWt0lEQVR42uxdaZA" +
            "d1XU+vb515s17GmkWbaMNJCwoCkwRyiLgpFwCu3BiYywXMXGwcYqYShmnKiFVJvnj/MifVPlHfuRHqEolFVdkQjDEhU1sbIP1w8JyF" +
            "GRhRiA0kkazaZb35u2vl3tz7u1+/Zbut82ISg+5RzrTr5d7u/t+95x7zrlLS5RSEPThJVkUgQBYkABYkABYkABYkABYkABYkABYACx" +
            "IACxIACxIACxIACxIACxIACwAFiQAFiQAFiQAFiQAFiQAFiQAFiQAFgALEgALEgALEgALEgALEgALEgALgAUJgAVtGVJFEXSn2cvvs" +
            "DJKth0edbdzu6eOVML8/FLYZ/hjAUu4uR35OPJY06nzyJeQzzYdq7ECd9McQD6KfJ977mXkHPJMwG1iyIfbju1H/ivkvT0e8RTy3yF" +
            "/H+9tCYD7B3YEN/uQX+yjkJvpJPKJ/6PH/gzySwg0FQA30cs//OkEAP2SbRljigwTiZh+QpIkkJElWQIFmf9j+yibiiy7v/Ea2X8c3" +
            "H2HZb7lBoebxiEK9VdnZUDYDv/vHGfHKKHO1r2mfpxf615H2q6p1cyT2ULt2c8+9MBFAXADYDo1MQyaHvGABMkBKx6Pg67pLkgOOOz" +
            "3yloWS5TwgmXXsUrgWY74m/KcWt+ted95b8ndUg9AQogLmHOMAajrUcxTBrcO8OPlUgFsYvMDHGQgznlMz559Zb32xKcf+PhzwshyC" +
            "yydQiCjwwiW4kgdl0YZkskkRCK6Lw0rdNNqbfK4HLVUWFdKvWPUAxTcisGk1IWtDXxnnwE2vtPfQlxfvAaWWXWvd/IGt2KYlg3LucW" +
            "jwopu4ACVSplLFAMYPFUqgVlbR9Uqt18ONhYiDcqI+iAPOE89mW78bge48XtpfgZUVWvJqVJeb6+l3vXFUo1l97oA2CVCyalyxTgmo" +
            "5oLIxnV4kDX27bF3mldANwQrDOWZR2zbb9MKoraZBjVG1mFt7BeBbFNXqhhoWLZZO80KwBuKNKlctWEeLQNR2yHI7FkHzlEoFTMcgP" +
            "pRlMkmvA1EdzhrpU63o8Q1nzQFQFwo/06zYwZipLYUlD4eLZt9+cOsGza0m/ex0DrXNE6g9hBa1RqhL1TTQDstcFomFRtSCdbwVS4M" +
            "dVfORGsCPYNBpiB2+n+DNxO90P7Dz770PGKALhhqZ7lPmebtLK2VdNj/QFMLH79jSbbCs7TNMod01TN8IT4Q/MkFUMKVMemZfQHBLH" +
            "7Vuf9a2il4/273YsQ9dsC4FYJXncKzS8tlllxfONeeXRRmRslZuTZAQB3V88sOqYLCW6mz//+g/Tki6/A/KUZUOyCG0N24smTuyYhG" +
            "u+tpo1aFaorK9zYcoxe15GSnBClz9Vqi1F4wSg34MEM5OhIAqLRqO/6fL4C67k8T0jcSJntbi15CGjylvMCYL8Un/r1j185Vl6dhWh" +
            "EgvSQgkYOwMTdB2DXTbt8EabWkBWFXLYIV381DRr6zSBZHFyZVxSKkggtYDs/2UG00onpBCq54StxwDjj/t6bNBhN+12k7LsmLF6ug" +
            "UWcWLWN1+aKNlQNCtH0HtjzySOXBMB+KTqTHJs6lpYX4Y6bVNBUR+JSMQPP2RxEqQnYijqGvxSIW3N8Pz0ShT1TO2DHnZ+Cq691jvE" +
            "rssZBHZ46CvHxg7D4i//gx/VEGiJDO6C8cskzrCKaAqVaBmKREt676rljI0kKh/cobbaCBm9ftqA2OsXeJReWcpXDAzD56PDIMNx9i" +
            "8bB1bDA49v3Y6NWRDRnka9BbX0R7NI80PI10GszoCG4tOxyZQ6qucUWcBVNg8T4zd5+ND0Ou45/FdRYEvKXz3ngMsrc9juw/e5PgjY" +
            "86h3Txj4C8tGHwR69Eyi6S4wJsmXaXv67P/YFvtVQVG4/qIKqsl4n8kxYyjUU3YXf+ff/PKiQ6nsHFv4BNHuNH0vsvg3iu46AfPFfI" +
            "R51IkbWns+DvD6NfC7AqpXg6nxrUEJSdEgduRdy51/zjunpCTCyC37JjiYhihWqNNvIe2JXHLTJu0DOngep2kiTzSmQKyiB+ZlKBt6" +
            "feBJsOXro0c89dFFIsNO2PpUungOdrHkd9eVr52DlFyexTa0rRgnUq88juL/29pvZMGUvrSyrnIEYsP72ay2d/2ZuqWm/waRW5PdsP" +
            "kZreVAWfuSAq8SgmjkORBt12nJ2H2zDzdxCSxr2Duxd2DsJFd0A+Okh8yofcdHOioKGD5HBMDS+rdUifNvOzECqp8ncfhw1wFFfXsm" +
            "9t8PI4XtbjmnRFOege6t4vAyHgEpRXom0oST+taE+2mTs/sdBiw370rF3Ye8kjKwmN0WhFRg+8gm+X5j+ceMccd2b1BE0qqpAx+8Du" +
            "3gF5IXX2vJoDMfJvfUDN1DR6hpVZv/Hdzw6tp9vy7Nv+duvfQ+AltwJ9P0XgBavgjTzPdfEc0abLL/xXOB92LuEZahbSKxox0+NT+7" +
            "je6V3/c6QXHgbqJ5CiTbQC8p7xw3YgbY0+qRQ4+5QO0UmjkIkMwXlq2fAKiz6w4pzb7lBjQAD5dobICV3A83PAkAziFLg9Y0ImNTmx" +
            "v0/B7je7bby+j/6JMLEtlWtP2WtAPDOd5wRHbaOLg8BbepOgNXfgGLNBgYzlEgcopNTUJk7651XExmIH7gX8udealwX2wZ2ZbUh2RO" +
            "3gjWMFWrpp56GaBhvIyDJFTxo9XwnAbAbwJBdI8V3jqnoAGFQDj6Iunwe4PJ/uf4ttpl6AiQtjbbVKrozTmdO9eovOTsVx7W4y2tQm" +
            "TnVcj8001r2SfYCyCbB+/tFVT94DKy5aTBWGkOs1eQuoHYNK8kyf5ewDEcOS6DjZF7de2LY8geATJsNnQ0orPe+7zs0fOsnQB6ZBHN" +
            "5Bornf9hda5TWuEHkVSS0ovk+ZREugu2ogQJKPNVMmh6hcP4HvOLV08uRJIzc/Xtg5Zchf+Z5wHfh7ySs6EY7+2+r2n4OJGM1PgIxV" +
            "KHsN/NvoXngYxcm5VWuhu3iqpdXEGupnXiPjO+4vv0gDN3xGdC37edtLOswqjMPZRLWhelKfFM6ahag8t4pqF7+Jd9n74KP8yMhwQ0" +
            "6XVC2gylnIErRF7bLaNZeB8W1VUizmhy5GcDC80X/kCdz5udQufhzR2V37lsALTMJtLSMbfpqq1SvvQfV0iJKcwFUjbbetx5QIcF5m" +
            "/OOscbegb0L0itCgl16/NGHF7DROnkh+imnHcS2zFqeBnfkLC9U4s4o0A7dC8rkrd5+MwcFMBir2w617Juzb4K1NhN4LRhObxaLfLf" +
            "nz3qMOMCZwyDHRgLTs3dg78LfSQDcJD2UPr4qT145H3kEiBJzCkxLcab8vMS5euafoTb9irffzHVDik9jiadBTt/sRKmy77WAoO05B" +
            "vrNn+5YITjQyT1AM3dikxzx8q/bTXpmOyia2hoJw2dmz87egb1LWMo1NL1JX/niI5Xn/uX5exakqfnR6jgk0eCaOP5Ffm7h1b+Hqal" +
            "6nJmgbAUPACiWZFhedjroY6ntkNx/FyyfmvZdl6hVQI8aUCgHW7pRncLwgTuAJHaCNjMPUvmKE4NeVzAN8vk3QEuOgtmUvqiOw9Lw/" +
            "itYG4985bFHKgLgQCkmi67Pwm3X/G/e4L03XHMaBCK61D7JpCV9bGwfSMsXHPdo4QLnoKa4fPkMlNtCFy0umIKG3tyrQJkGKV8GQz+" +
            "MhnUZja0FLw21q63pJf78L371D0+Ear5wqGb4Y+HQRjSI9RCeg9riBf7btpwJXtDC7lwk18SVC++CmkhD6iMP8G03FdyZFVBVzNPIg" +
            "lS67NShQ2gbTHyUW/SeSq4WW1W6Q0sQMgrdEg5sZEde3e23Xu06mM3cBLTLxCiBXVnj277VWGK7I7nRIUjsu9Mn2fqF50CZw3bf9st" +
            "88uBvY5s8BSVljD37aQFwb4DPNBtLdbasJkmFOtM2JqDJBqrgN7FGGIESmtj/MYjsuLm1W5BU3S7DAk+r621hRjOHrluVW9Dt+cm6h" +
            "s9sgC3pEMbJ9GEEeCkrT/p6fBm2ssQCH2pglMMmDrNr/L3FDa4tvAV2Ya4172qhZb8+1djU0JJWnEF3liUF5ld85zWwc/NQkYbYs08" +
            "LgHsDfDoo+GyawAGku37XA7MqTbi/m1V1D0MO207SY7ag7IZGlWi80UQkj3RNU5WS7NlDtyCLGj6ACeSlbQE9D46kKvONAJEmYztbn" +
            "5HoblRFAqPLENm+CkV1Jo5L+Wkva2vtAnPMO6YxgY+FLgqAe9NZEzQfvqYl+SZ3M0vX5+KoxBsoL8k6yNEM2OXFTT+UZcnQrd7kpQx" +
            "87ct/ELpVdkKooh0uSZO+oTCt7W5ganeslHO9vn0/pO95GGQ1EjgkJ4gjOgm8D6Hd0+EzXwmhsIRSgvk0FouNg2rDsWbUAeiPzOsXY" +
            "O0nF3pep40dAXVoDCoXfxZYaTjAXW6blfhIlBfDCHDoJPipJx6jbDRERUp1Kutu8g+6NvhICmv1fajOnnENLP/5UvQetKaHuhtvJJz" +
            "LT4R1rcpTFbRK/b6wo6YtU3W68rx1jdDWUsehpt4EQT50L2Y+MxhOZEpVKNS0I0D0Se9h4knKve5O6dfkneyylwXAfRJKw5kKWx5So" +
            "i3Mx0UxTPc8CHT0t1qsazmWAm047cw9kjbObC6Tlt6BBnNjhqC1+CZQo9A5XYglOKyLkS5VIBEAvGPGavN+YWEuDQ9SKJursxpa4fL" +
            "11hWQvKG7nSxoyLDNtAC4fzptUs03cqJ5ZGPHF1JI19EcG9Moctc8LeD+cUUA3H80C7KQ9vXnOVM8P9h7awFGmt1D+xZpgj1zLYxlG" +
            "c42mJKzyGBA6+Rry5Y+8HtLEg2U4K4Akxg8/SdfrgiA+xZhhwsw4bd4+xheyaRwI33BnWYr8LBlhzQmRMMyiWFLuUneMoDtvTdspkN" +
            "PKdwgs/bbA1VOghm9xVHRttwxTR4rIdK3BcAD0J899QRl7fAynbxBRpICnQfodKgkqgry2JG+AixhXjU/zB/lOBUkjrbde8Ud1uHQn" +
            "CZx92OgpMZ7ijBPVycjB8qVF3gnQ7c0biV8PayFGNqPcrCRHctkxzFZ20CtbWtPa//9T85xuXe6oPa3azq7sQyUkOCB7Cy6FOQTERr" +
            "8yJY0Cqa6s9EIb8iC7qTeO9OyvZ0966wAeFCACT29ZqeCjger5aFRUDIHN4MvKIodaNB3d+n4tx1WwlqOIVbRBGpU8YHVKZrFQ5XuC" +
            "AxFttmKHhtzz9o1sCl1rTBZrISUEhAAD078e0hZMg4ZZaEnwO1+UlDAordxRgfOy6AqPPP013JhLcTwqmjqfEDDoNGAcx9MRGvQKFa" +
            "RpCHsHxYLs5u07qjAbQGFLvVoS+kGwB38AYuEfbsrHBO9txzAf/mNp6gjwXrA2KzektjvGKzGck0BnQy23DWNCREmwQsC4E0EO4okz" +
            "gFrZlbw/YA8GA+ez5rN+4HPC4A3SDYhZwokfsN82q4FIQdLcB/PeCnMZRj2z8suFa2oDyxK+5BgBhjZfP3tVlEWDG4f5ATAGzelTxf" +
            "sqM9B7d9w7d/YUuROFnTPnoYZoaI3Tlw6ajQ2sJs0qIoOWqqpVx4LRhrCTqEGmFAyw0Z2rJhtPUF9tan2YJ3BQfcnUtc07Nme/fOvC" +
            "xW9cRXtbJg70j5YkrXDkkS6SLAEgwyw9BlZbIHULumvG5OhHsmxJST4r5/5BpeOFdO/HEOvdlgCOtjgd5/2kLtebxA+bvpU2AEOuxX" +
            "dFAocTFwa47f6uXhwIy1vD3urEQgJ3hydnKtlAoCXegY6+q8MZOD8CzYfmL8kJHjzhtaCM6xxI07sZp3gzqeqRGXPdlpI8Obp/FxtZ" +
            "GAJGwTcIGnvlf+KMQRbgcLfBhP6gYcCN7biAx/JcVYAfAOCHWwJtOvGOIxF5gcEjvQNVpD0dkt/rZKCreAnbYU2mIcCa3bUp3WJrTj" +
            "qtcNK8VLfWkKGFihp77SUr24rrQuAbxCdq9wGef0mKLM1paEIimSx74ODTC38bYPCfgObWcgWKyV8KSQOGyUt3yxsyKy7qIskOcuqs" +
            "dVk3eXVmnJzvkJOFWB3M2iErwSfLTumy7e++RdUALxJ+ptnn8l981t/C5fycV74O5IFsCS2mI3BP0KpggkybqlkImTsuIWYITyS7Xz" +
            "jiMHGQaeN6IgkecEMwj9TqeApNjxWcYqEsmLR8DwDV+XTQy2sKATzWK1qcCkX3RJBjq0jwQiMaVF457oMv7psQVy1Ia6ryAokdR2Go" +
            "9Rb3nDXiM1lkO9LzjFn9R3iM7P510a9RRAdib1eUKBqyxz8qiXDWhmrEu7nqxQqFlYoXYNohE9yOyMAvoHBDuQTqqrC8HAKLNuCbLU" +
            "K14smGKbJv8Zt+T7FLrkSqQxwG9tlNstBBg0rj6IooGNFikRikIxpsNVI3RoC3DruSZEViMcTgdfWapubh80qEQO1k2HVRC8LgG9gs" +
            "KN5QsP9dx2EbSNR3klvoQRn81X+OXZZdYbYliomFPJrffu3DLdEXOcSSim4BpcE6eEYAq7xGf7vX8vBW9PXhAR/MK4StAQ7hocSzsK" +
            "kaPgoCMCObQqq0yTEMoe9r5sZubfR3so3Oh2apU9qWNB1QPnXXUDyrGmbOL/Zp5PYyI5oJNL+WNMC4BtEWLi5aq3q7VtU5g4MXyUag" +
            "WZfPZMRDB0NoFg0gm0yQYAZSLK7rJLUGtCg9f5GyQPVOSvzFe3qH+FwQJabPvrRqCRDyaHKVii7rRCLhm3bRmcUmX9Zm/PaeoX7pgx" +
            "Axmztjlq1jBVBR1Ub4yBTSecVgTOps+IyO66AydJTR1otNx/nOmfLz7npna+uOPdnFQmNvaKQ4BuloglZZ0ZVvuAEjmoGQTBkPuKC8" +
            "n8S/54Dl1zDxHM2+64OAperO0T+cKQ77oav3AN1Ve2MFPE+1eOqauZOrazlvbS6Frnyp3/8JUtI8OZoxOWPf/3Jx+/fu3vXZQ3bW4Z" +
            "TqVzjqtMmrdJZrlRhvVCEQrGMfjPh3z1sSKXSwrYnsY1rbE+63Tztxj0Mi9cEYM+wd9dONh/448gH3WcMraBIIZo8xQrrPuQ/Qkk6R" +
            "ogNtoX+rWlBDS3l2Wvz8N3vvYQSanA1mU6leNOaTg05w2iYKs+MoPrUkWOYrgyWUUJLOMH9WKlFep0/hmmjBV52l7x05Nw0CeQKzjE" +
            "TzxfKFd5eZ9fXucRH0Nh6/NEvYLORRknWHLdKVUB1XCu2GAtbzuFVCMnCaGEBmEnDTwgiayKYjMvVGhQKJVjLrsP1lVWYX1yAi+9fh" +
            "MWFOV/ngqK0ChB3meTBlJNlWT7fySatE8JNrGz7pg7AoYOHYGJsDEa3ZSCTTqHBFYcYAq9HnMCI7KwFofG4qWiDOf0M+RDy51AansQ" +
            "2d28EpcNCY4kVngO6wX1eioV+8eK7sLy8xNvaSrnMzzPJkiTZBVji/mv/gRTCwfPAti1+L5anrkf4dnxsHA4eOgx79+xBTZGBVGoYk" +
            "ok4N+yYJLufumMRN/bV0RfCAG7YVHTLc6E0pwglo6imd9u2lUID6r5qzWBG1ASCcaJUqUC5VEIpL0K+WIBsNovSvobHylBDl6qGqpx" +
            "FtZhKZ5UD8wDiRkuYdGuueq0DGNEdCRxKJiGd3gYjIyNoKQ/x/WQiwVy1K6qqvBiLRRFQdUlR5NNMc2BeZ12pDeX4aCnsE5j7s7JpD" +
            "CtDhLpfYGFL+1LG7iRydrz5LesaXpIlLvXOKne4lZllLvPjsiSvy7K05QvnQwGwoC0e6BAkABYkABYAC/oQ0v8KMACcEU7RyluZ6wA" +
            "AAABJRU5ErkJggg==" },
        numberOfDrinks: 0,
        score: 0,
        latitude: 37.7750,
        longitude: 122.4183

    }
});

window.BeerCollection = Backbone.Collection.extend({
    model: Beer,
    endpoint: function() {
        return gapi.client.birra.beers;
    }

});