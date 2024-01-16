module.exports = [
    {
      value: "--help",
      description: "List all available commands",
      default: true
    },
    {
      value: "--refresh",
      description: "Forcefully overwrite all keys"
    },
    {
      value: "--generate",
      description: "Generate keys where missing"
    },
    {
      value: "--clear",
      description: "Clear values of keys"
    },
    {
      value: "--dryrun",
      description: "Print involved variables based on the launched command"
    },
    {
      value: "--print",
      description: "Print newly generated variables to the console"
    },
    {
      value: "--status",
      description: "Print the status of keys: check the correct encoding of the keys"
    },
    {
      value: "--rand",
      description: "Print a single crypto key in base64",
    },
    {
      value: "--exclude=",
      description: "Exclude certain keys from the changes operations",
      withValues: true
    },
    {
      value: "--only=",
      description: "Include only certain keys in changes operations",
      withValues: true
    }
  ];
  