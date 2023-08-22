function monocd {
    DIR_PATH=$( [[ ! -z "$1" ]] && (mtab $1 --notab 3>&1 1>&2 2>&3) || (mtab --notab 3>&1 1>&2 2>&3) );
    [[ ! -z "$DIR_PATH" ]] && cd $DIR_PATH || echo "CANCELLED";
};
