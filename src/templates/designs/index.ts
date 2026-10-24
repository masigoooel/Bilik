// Registry semua kategori desain, urut seperti design-reference/README.md
import type { DesignCategory } from './define'
import { CATEGORY as klasik } from '../klasik'
import { CATEGORY as retro } from '../retro'
import { CATEGORY as cute } from '../cute'
import { CATEGORY as kalcer } from '../kalcer'
import { CATEGORY as bestie } from '../bestie'
import { CATEGORY as editorial } from '../editorial'
import { CATEGORY as pop } from '../pop'
import { CATEGORY as meme } from '../meme'
import { CATEGORY as travel } from '../travel'
import { CATEGORY as gaming } from '../gaming'
import { CATEGORY as dark } from '../dark'
import { CATEGORY as y2k } from '../y2k'

export const DESIGN_CATEGORIES: DesignCategory[] = [klasik, retro, cute, kalcer, bestie, editorial, pop, meme, travel, gaming, dark, y2k]
