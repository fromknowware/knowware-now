#!/bin/zsh
# usage: mkgrid.sh <dir> <out.jpg> name1:"caption" name2:"caption" ...   (each name has -before/-after-<device>.jpg; use name@before / name@after for single-sided rows)
dir=$1; out=$2; shift 2
items=()
for spec in "$@"; do
  key=${spec%%:*}; cap=${spec#*:}
  tag=${key##*@}; name=${key%%@*}
  for dev in iphone-se-1 iphone-se phone-large; do
    case $dev in iphone-se-1) w=320;; iphone-se) w=375;; *) w=430;; esac
    items+=("$cap @${w}|$dir/$name-$tag-$dev.jpg")
  done
done
python3 ${0:A:h}/grid.py $out 300 3 "${items[@]}"
